/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prosper-django-bucket.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prosper-django-bucket.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drifully-backend-1qa6.onrender.com",
        pathname: "/**",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/backend/:path*',
  //       destination: 'https://drifully-backend-1qa6.onrender.com/:path*',
  //     },
  //   ];
  // },
};


export default nextConfig;
