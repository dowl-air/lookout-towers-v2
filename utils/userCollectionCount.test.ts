import assert from "node:assert/strict";
import test from "node:test";

import { getUserCollectionCount } from "@/utils/userCollectionCount";

test("counts only documents belonging to the requested user", async () => {
    let requestedField = "";
    let requestedOperator = "";
    let requestedUserId = "";

    const collection = {
        where: (field: string, operator: string, userId: string) => {
            requestedField = field;
            requestedOperator = operator;
            requestedUserId = userId;

            return {
                count: () => ({
                    get: async () => ({
                        data: () => ({ count: 4 }),
                    }),
                }),
            };
        },
    };

    const count = await getUserCollectionCount(collection, "user-123");

    assert.equal(count, 4);
    assert.equal(requestedField, "user_id");
    assert.equal(requestedOperator, "==");
    assert.equal(requestedUserId, "user-123");
});
