/** @type {import('next').NextConfig} */
const nextConfig = {
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
        minimumCacheTTL: 2592000,
    },
    env: {
        MEILI_KEY: process.env.MEILI_KEY,
    },
};

module.exports = nextConfig;
