import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogHeroSlider from "@/components/BlogHeroSlider";
import BlogList from "./BlogList";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog & Travel Tips",
  description:
    "Explore travel ideas, driving tips, and everything you need for a smoother ride with Drifully.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className={styles.heroContainer}>
          <BlogHeroSlider />
        </section>

        <BlogList />
      </main>
      <Footer />
    </>
  );
}
