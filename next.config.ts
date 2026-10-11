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
  async rewrites() {
    return [
      {
        source: '/admin/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/admin/REZARVA.svg',
        destination: '/REZARVA.svg',
      },
      {
        source: '/admin/logo.svg',
        destination: '/logo.svg',
      },
      {
        source: '/admin/images/:path*',
        destination: '/images/:path*',
      },
      {
        source: '/admin/icons/:path*',
        destination: '/icons/:path*',
      },
    ];
  },
};


export default nextConfig;
