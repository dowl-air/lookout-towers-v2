import { checkAuth } from "@/actions/checkAuth";

export const checkAdmin = async () => {
    const user = await checkAuth();
    if (!user) return false;
    return user.id === "iMKZNJV5PE4XQjnKmZut";
};
