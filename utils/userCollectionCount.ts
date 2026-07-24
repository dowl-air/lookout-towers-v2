type CountableQuery = {
    count: () => {
        get: () => Promise<{
            data: () => { count: number };
        }>;
    };
};

type UserOwnedCollection = {
    where: (field: "user_id", operator: "==", userId: string) => CountableQuery;
};

export const getUserCollectionCount = async (
    collection: UserOwnedCollection,
    userId: string
): Promise<number> => {
    const snapshot = await collection.where("user_id", "==", userId).count().get();
    return snapshot.data().count;
};
