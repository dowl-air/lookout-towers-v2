import "server-only";

const Typesense = require("typesense");

export const typesenseClient = new Typesense.Client({
    nodes: [
        {
            host: process.env.TYPESENSE_HOST,
            port: 443,
            protocol: "https",
        },
    ],
    apiKey: process.env.TYPESENSE_KEY,
    connectionTimeoutSeconds: 2,
});
