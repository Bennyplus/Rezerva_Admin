"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface FeatureImageSliderProps {
  images: string[];
  alt: string;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export default function FeatureImageSlider({ images, alt, fill, sizes, style }: FeatureImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {images.map((img, idx) => (
        <Image
          key={img}
          src={img}
          alt={`${alt} ${idx + 1}`}
          fill={fill}
          sizes={sizes}
          style={{
            ...style,
            opacity: currentIndex === idx ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      ))}
    </>
  );
}
