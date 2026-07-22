import Image from "next/image";

function UserProfileAvatar({
    name,
    image,
    size = 48,
}: {
    name: string;
    image?: string;
    size?: number;
}) {
    return (
        <>
            {image ? (
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
            ) : (
                <div className="avatar avatar-placeholder cursor-pointer">
                    <div
                        className="bg-base-200 text-base-content rounded-full"
                        style={{ width: `${size}px`, height: `${size}px` }}
                    >
                        <span className="text-xl font-medium">
                            {name ? name.substring(0, 2) : "TY"}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserProfileAvatar;
