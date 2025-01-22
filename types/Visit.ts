import { Photo } from "@/types/Photo";

export type Visit = {
    tower_id: string;
    user_id: string;
    date: string;
    text: string;
    created: string;
    urls?: string[];
    photoIds?: string[];
    photos?: Photo[];
};
