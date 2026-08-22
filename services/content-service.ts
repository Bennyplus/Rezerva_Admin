import { publicApi } from '@/lib/api-client';

export interface ContentItem {
  id: number | string;
  title: string;
  contentType: "Legal Document" | "Help Articles" | "Onboarding Screens";
  lastUpdated: string;
  updatedBy: string;
  status: "Published" | "Draft" | "Scheduled";
  message: string;
  callToAction?: string;
  mediaAttachment?: string;
}

// Transform backend Blog item to ContentItem interface
const transformBlog = (blog: any): ContentItem => {
  return {
    id: blog.id,
    title: blog.title || "",
    contentType: "Help Articles", // Map blogs to Help Articles category by default
    lastUpdated: blog.created_at
      ? new Date(blog.created_at).toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true
        })
      : "--",
    updatedBy: "Admin",
    status: blog.is_published ? "Published" : "Draft",
    message: blog.excerpt || blog.content || "",
    mediaAttachment: blog.cover_image || undefined,
  };
};

export const contentService = {
  /**
   * Fetch all content list
   * GET administration/blogs/
   */
  getContents: async (page: number = 1, search: string = ""): Promise<{ results: ContentItem[]; count: number }> => {
    const response = await publicApi.get('', {
      params: {
        path: 'administration/blogs/',
        page,
        ...(search && { search })
      }
    });
    const data = response.data;
    const results = Array.isArray(data)
      ? data.map(transformBlog)
      : Array.isArray(data.results)
      ? data.results.map(transformBlog)
      : [];
    return {
      results,
      count: data.count !== undefined ? data.count : results.length
    };
  },

  /**
   * Fetch single content item by ID
   * GET administration/blogs/?blog_id={id}
   */
  getContentById: async (id: string | number): Promise<ContentItem | null> => {
    const response = await publicApi.get('', {
      params: {
        path: 'administration/blogs/',
        blog_id: id
      }
    });
    return transformBlog(response.data);
  },

  /**
   * Create new content item
   * POST administration/blogs/
   */
  createContent: async (payload: Omit<ContentItem, "id" | "lastUpdated" | "updatedBy">, coverFile?: File): Promise<ContentItem> => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("excerpt", payload.message);
    formData.append("is_published", payload.status === "Published" ? "True" : "False");
    formData.append("is_featured", "False");
    
    if (coverFile) {
      formData.append("cover_image", coverFile);
    } else if (payload.mediaAttachment && !payload.mediaAttachment.startsWith("blob:")) {
      formData.append("cover_image_url", payload.mediaAttachment);
    }

    const response = await publicApi.post('', formData, {
      params: { path: 'administration/blogs/' },
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return transformBlog(response.data);
  },

  /**
   * Update existing content item
   * PUT/PATCH administration/blogs/?blog_id={id}
   */
  updateContent: async (id: string | number, payload: Partial<ContentItem>, coverFile?: File): Promise<ContentItem> => {
    const formData = new FormData();
    if (payload.title) formData.append("title", payload.title);
    if (payload.message) formData.append("excerpt", payload.message);
    if (payload.status) formData.append("is_published", payload.status === "Published" ? "True" : "False");
    
    if (coverFile) {
      formData.append("cover_image", coverFile);
    }

    const response = await publicApi.put('', formData, {
      params: {
        path: 'administration/blogs/',
        blog_id: id
      },
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return transformBlog(response.data);
  },

  /**
   * Publish a draft content item
   */
  publishContent: async (id: string | number): Promise<ContentItem> => {
    return contentService.updateContent(id, { status: "Published" });
  },

  /**
   * Duplicate a content item
   */
  duplicateContent: async (id: string | number): Promise<ContentItem> => {
    const item = await contentService.getContentById(id);
    if (!item) throw new Error("Item not found");

    return contentService.createContent({
      title: `${item.title} (Copy)`,
      contentType: item.contentType,
      status: "Draft",
      message: item.message,
      callToAction: item.callToAction,
      mediaAttachment: item.mediaAttachment
    });
  },

  /**
   * Delete content item
   * DELETE administration/blogs/?blog_id={id}
   */
  deleteContent: async (id: string | number): Promise<boolean> => {
    await publicApi.delete('', {
      params: {
        path: 'administration/blogs/',
        blog_id: id
      }
    });
    return true;
  }
};
