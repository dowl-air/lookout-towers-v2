import { Tower } from "@/types/Tower";
import Image from "next/image";
import Link from "next/link";

const TowerPhoto = ({ tower, index }: { tower: Tower; index: number }) => {
    return (
        <Link href={`/${tower.type}/${tower.nameID}`}>
            {tower.mainPhotoUrl ? (
                <figure className="relative h-56 w-48 rounded-lg">
                    <Image
                        alt={tower.name}
                        src={tower.mainPhotoUrl}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
                        className="object-cover object-top"
                        fill
                    />
                    <span className="absolute top-0 left-0 text-white bg-black bg-opacity-50 p-2 rounded-br-lg text-lg">#{index}</span>
                </figure>
            ) : (
                <figure className="bg-gray-300 h-56 w-48 flex items-center justify-center rounded-lg relative">
                    <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                    <span className="absolute top-0 left-0 text-white bg-black bg-opacity-50 p-2 rounded-br-lg text-lg">#{index}</span>
                </figure>
            )}
        </Link>
    );
};

export default TowerPhoto;
