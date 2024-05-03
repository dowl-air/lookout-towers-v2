import Image from "next/image";
import React from "react";

function UserProfileAvatar({ name, image, size = 48 }: { name: string; image?: string; size?: number }) {
    return (
        <>
            {image ? (
                <label tabIndex={0}>
                    <div className="avatar cursor-pointer">
                        <div className="rounded-full" style={{ width: `${size}px` }}>
                            <Image
                                src={image}
                                width={size}
                                height={size}
                                alt={`profile picture of ${name}`}
                                referrerPolicy="no-referrer"
                                unoptimized
                            />
                        </div>
                    </div>
                </label>
            ) : (
                <label tabIndex={0}>
                    <div className="avatar placeholder cursor-pointer">
                        <div className="bg-neutral-focus text-neutral-content rounded-full" style={{ width: `${size}px` }}>
                            <span>{name ? name.substring(0, 2) : "TY"}</span>
                        </div>
                    </div>
                </label>
            )}
        </>
    );
}

export default UserProfileAvatar;
