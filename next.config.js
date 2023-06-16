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
        ],
        minimumCacheTTL: 2592000, // one month TTL for images
    },
};

module.exports = nextConfig;
