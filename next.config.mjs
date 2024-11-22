/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nrncfuidxyiujrvmqjix.supabase.co",
      },
      {
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;
