import { Filter } from "@/typings";
import { DocumentSnapshot } from "firebase-admin/firestore";
import { collection, limit, orderBy, query, startAfter, where } from "firebase/firestore";

export const towersQuery = (filter: Filter, previousElm: DocumentSnapshot) => {
    if (filter.county && filter.province)
        return query(
            collection(db, "towers"),
            where("name", ">=", filter.searchTerm),
            where("name", "<=", filter.searchTerm + "\uf8ff"),
            where("province", "==", filter.province),
            where("county", "==", filter.county),
            orderBy("name"),
            startAfter(previousElm),
            limit(20)
        );
    if (filter.province)
        return query(
            collection(db, "towers"),
            where("name", ">=", filter.searchTerm),
            where("name", "<=", filter.searchTerm + "\uf8ff"),
            where("province", "==", filter.province),
            orderBy("name"),
            startAfter(previousElm),
            limit(20)
        );
    return query(
        collection(db, "towers"),
        where("name", ">=", filter.searchTerm),
        where("name", "<=", filter.searchTerm + "\uf8ff"),
        orderBy("name"),
        startAfter(previousElm),
        limit(20)
    );
};
