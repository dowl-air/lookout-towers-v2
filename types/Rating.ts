import { User } from "@/types/User";

export type Rating = {
    tower_id: string;
    user_id: string;
    rating: number;
    created: string;
    text: string;
    user?: User;
};
