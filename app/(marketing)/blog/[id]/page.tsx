"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Spinner from "@/components/admin/Spinner";
import { marketingService } from "@/services/marketing-service";
import styles from "./article.module.css";

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    marketingService.getBlogById(unwrappedParams.id)
      .then(data => {
        if (data) setBlog(data);
        else setError("Blog not found.");
      })
      .catch(err => {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog.");
      })
      .finally(() => setLoading(false));
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: '120px', minHeight: '60vh', textAlign: 'center' }}>
          <Spinner />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: '120px', minHeight: '60vh', textAlign: 'center' }}>
          <h1 className="heading-1">{error || "Blog Not Found"}</h1>
          <p style={{ marginTop: '20px' }}>
            <Link href="/blog" className="btn btn-primary">Back to Blogs</Link>
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="container">
          <article className={styles.articleContainer}>
            <Link href="/blog" className={styles.backButton} aria-label="Go back">
              <ArrowLeftIcon />
            </Link>

            <header className={styles.headerSection}>
              <h1 className={styles.title} style={{ maxWidth: '800px', margin: '0 auto 16px auto', textAlign: 'center' }}>
                {blog.title}
              </h1>
              <p className={styles.subtitle} style={{ margin: '0 auto', textAlign: 'center' }}>
                {blog.excerpt}
              </p>
            </header>

            {blog.cover_image && (
              <div className={styles.imageSection}>
                <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '24px', overflow: 'hidden', marginBottom: '40px', backgroundColor: '#f3f4f6' }}>
                  <Image 
                    src={blog.cover_image} 
                    alt={blog.title} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    priority 
                  />
                </div>
              </div>
            )}

            <div 
              className={styles.blogBody}
              dangerouslySetInnerHTML={{ __html: blog.body }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
