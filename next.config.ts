/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prosper-django-bucket.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};


export default nextConfig;
