"use client";

import dynamic from "next/dynamic";

const TowerMapFixed = dynamic(() => import("@/components/shared/map/base/TowerMap"), { ssr: false });

export default TowerMapFixed;
