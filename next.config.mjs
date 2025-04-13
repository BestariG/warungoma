/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/images/:path*",
          destination: "http://localhost:5000/images/:path*", // Proxy ke backend
        },
      ];
    },
  };
  
  export default nextConfig;
  