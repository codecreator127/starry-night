/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos'], // <-- whitelist your image host
  },
};

export default nextConfig;
