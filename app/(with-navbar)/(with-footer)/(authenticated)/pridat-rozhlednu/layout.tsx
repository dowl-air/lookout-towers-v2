"use client";

import { NewTowerProvider } from "@/context/NewTower";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
    return <NewTowerProvider>{children}</NewTowerProvider>;
};

export default Layout;
