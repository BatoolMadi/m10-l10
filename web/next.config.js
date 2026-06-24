/** @type {import('next').NextConfig} */
const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    return [
      { source: "/api/extract", destination: `${backendUrl}/extract` },
      { source: "/api/kg/:path*", destination: `${backendUrl}/kg/:path*` },
      { source: "/api/rag/:path*", destination: `${backendUrl}/rag/:path*` },
    ];
  },
};

module.exports = nextConfig;
