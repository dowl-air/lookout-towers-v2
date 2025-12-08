import { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,
    reactCompiler: true,
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
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

export default nextConfig;
