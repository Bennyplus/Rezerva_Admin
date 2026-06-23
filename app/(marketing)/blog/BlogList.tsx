"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { marketingService } from "@/services/marketing-service";
import Spinner from "@/components/admin/Spinner";
import styles from "./blog.module.css";

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketingService.getBlogs()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '120px 0', minHeight: '50vh' }}>
        <Spinner />
      </div>
    );
  }

  const gettingStartedBlog = blogs.find(b => String(b.id) === "1");
  const otherBlogs = blogs.filter(b => String(b.id) !== "1");

  const featuredBlogs = otherBlogs.filter(b => b.is_featured);
  const nonFeaturedBlogs = otherBlogs.filter(b => !b.is_featured);

  // Force Getting Started blog to be the main hero blog, otherwise fallback to the first featured
  const mainBlog = gettingStartedBlog || featuredBlogs[0];
  const sideBlogs = gettingStartedBlog ? featuredBlogs.slice(0, 2) : featuredBlogs.slice(1, 3);

  return (
    <div className="container">
      {featuredBlogs.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Top Blogs</h2>
            <p className={styles.sectionDesc}>A curated selection of must-read articles to help you move smarter and travel better</p>
          </div>

          <div className={styles.topBlogsGrid}>
            {mainBlog && (
              <Link href={`/blog/${mainBlog.id}`} className={`${styles.card} ${styles.mainBlogCard}`}>
                <div className={styles.cardImageWrapper}>
                  <Image
                    src={mainBlog.cover_image || "/images/placeholder-car.png"}
                    alt={mainBlog.title}
                    fill
                    className={styles.cardImage}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className={styles.cardTitle}>{mainBlog.title}</h3>
                <p className={styles.cardDesc}>{mainBlog.excerpt}</p>
                <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
              </Link>
            )}

            {sideBlogs.length > 0 && (
              <div className={styles.sideBlogCards}>
                {sideBlogs.map(blog => (
                  <Link key={blog.id} href={`/blog/${blog.id}`} className={styles.horizontalCard}>
                    <div className={styles.cardImageWrapper}>
                      <Image
                        src={blog.cover_image || "/images/placeholder-car.png"}
                        alt={blog.title}
                        fill
                        className={styles.cardImage}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.horizontalCardContent}>
                      <h3 className={styles.cardTitle}>{blog.title}</h3>
                      <p className={styles.cardDesc}>{blog.excerpt}</p>
                      <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {nonFeaturedBlogs.length > 0 && (
        <section className={styles.section} style={{ paddingTop: '240px' }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Insights for every journey</h2>
            <p className={styles.sectionDesc}>Explore travel tips, driving guides, and smarter ways to move — designed to make every trip easier and more enjoyable</p>
          </div>

          <div className={styles.insightsGrid}>
            {nonFeaturedBlogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.id}`} className={`${styles.card} ${styles.insightCard}`}>
                <div className={styles.cardImageWrapper}>
                  <Image src={blog.cover_image || "/images/placeholder-car.png"} alt={blog.title} fill className={styles.cardImage} style={{ objectFit: 'cover' }} />
                </div>
                <h3 className={styles.cardTitle}>{blog.title}</h3>
                <p className={styles.cardDesc}>{blog.excerpt}</p>
                <div className={styles.readMore}>Read More <span style={{ color: '#868C98' }}> &rarr;</span> </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
