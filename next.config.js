/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        swcPlugins: [["next-superjson-plugin", {}]],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                port: "",
                pathname: "/lookout-towers.appspot.com/**",
            },
            {
                hostname: "*.googleusercontent.com",
            },
            {
                hostname: "firebasestorage.googleapis.com",
            },
        ],
        minimumCacheTTL: 2592000, // one month TTL for images
    },
    env: {
        MEILI_KEY: process.env.MEILI_KEY,
    },
};

module.exports = nextConfig;
