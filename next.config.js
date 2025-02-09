/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
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
            {
                hostname: "i.im.cz",
                protocol: "https",
            },
        ],
        minimumCacheTTL: 2592000,
    },
};

module.exports = nextConfig;
