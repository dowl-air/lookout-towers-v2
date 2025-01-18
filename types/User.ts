import { Tower } from "@/types/Tower";

export type User = {
    name: string;
    email: string;
    image?: string;
    id: string;
    visits?: number;
    changes?: number;
    lastVisited?: {
        tower: Tower;
        date: string;
    };
};
