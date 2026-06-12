"use client";

import { ReactNode } from "react";

import { NewTowerProvider } from "@/context/NewTower";

const Layout = ({ children }: { children: ReactNode }) => {
    return <NewTowerProvider>{children}</NewTowerProvider>;
};

export default Layout;
