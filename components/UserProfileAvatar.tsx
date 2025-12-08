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
                        />
                    </div>
                </div>
            ) : (
                <div className="avatar avatar-placeholder cursor-pointer">
                    <div
                        className="bg-neutral text-neutral-content rounded-full"
                        style={{ width: `${size}px`, height: `${size}px` }}
                    >
                        {name ? name.substring(0, 2) : "TY"}
                    </div>
                </div>
            )}
        </>
    );
}

export default UserProfileAvatar;
