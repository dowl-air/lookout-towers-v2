"use client";

import dynamic from "next/dynamic";

const MainMapFixed = dynamic(() => import("@/components/shared/map/base/MainMap"), { ssr: false });

export default MainMapFixed;
