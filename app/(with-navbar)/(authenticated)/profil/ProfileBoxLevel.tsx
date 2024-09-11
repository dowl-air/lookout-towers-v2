"use client";
import { getUserLevel } from "@/utils/userLevels";

const ProfileBoxLevel = ({ score }: { score: number }) => {
    const { name, color, level } = getUserLevel(score);
    return (
        <div
            className="badge badge-lg cursor-pointer scale-105 hover:scale-110"
            style={{ backgroundColor: color, color: level > 3 ? "white" : "black" }}
            onClick={() => (document.getElementById("user_levels") as HTMLDialogElement).showModal()}
        >
            {name}
        </div>
    );
};

export default ProfileBoxLevel;
