"use client";

import dynamic from "next/dynamic";

const MainMap = dynamic(() => import("@/components/shared/map/MainMap"), { ssr: false });

export default MainMap;
