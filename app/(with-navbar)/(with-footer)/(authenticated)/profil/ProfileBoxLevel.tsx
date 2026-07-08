"use client";

import UserLevelBadgeButton from "@/components/shared/UserLevelBadgeButton";
import { getUserLevel } from "@/utils/userLevels";

const ProfileBoxLevel = ({ score }: { score: number }) => {
    const { name, color, textColor } = getUserLevel(score);
    return <UserLevelBadgeButton color={color} name={name} textColor={textColor} />;
};

export default ProfileBoxLevel;
