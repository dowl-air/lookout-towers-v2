"use client";

import dynamic from "next/dynamic";

const ProfileMapFixed = dynamic(() => import("@/components/shared/map/base/ProfileMap"), { ssr: false });

export default ProfileMapFixed;
