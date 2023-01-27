import React from "react";

import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const getTowerObjectFast = async (id: string) => {
    const snap = await getDoc(doc(db, "towers", id));
    return snap.exists() ? snap.data() : {};
};

async function HomePage() {
    <div>tower</div>;
}

export default HomePage;
