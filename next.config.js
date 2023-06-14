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
        ],
    },
};

module.exports = nextConfig;
