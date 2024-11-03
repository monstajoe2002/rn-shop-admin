/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nrncfuidxyiujrvmqjix.supabase.co",
      },
    ],
  },
};

export default nextConfig;
