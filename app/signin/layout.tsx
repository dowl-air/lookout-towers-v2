import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

const SuspenseBoundary = ({ children }: { children: ReactNode }) => {
    return <Suspense>{children}</Suspense>;
};

export default SuspenseBoundary;
