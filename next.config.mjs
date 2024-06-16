/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "enduring-cat-380.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
