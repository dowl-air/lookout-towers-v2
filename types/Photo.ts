export type PhotoNote = {
    headline: string;
    text: string;
    url: string;
};

export type Photo = {
    url: string;
    created: string | Date;
    id: string;
    user_id: string;
    tower_id: string;
    isPublic: boolean;
    note?: PhotoNote;
    isMain?: boolean;
};
