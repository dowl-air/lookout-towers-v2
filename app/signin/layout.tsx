import { ReactNode, Suspense } from "react";

const SuspenseBoundary = ({ children }: { children: ReactNode }) => {
    return <Suspense>{children}</Suspense>;
};

export default SuspenseBoundary;
