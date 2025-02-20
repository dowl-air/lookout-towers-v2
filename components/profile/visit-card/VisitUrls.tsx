import { Visit } from "@/types/Visit";
import { extractDomain } from "@/utils/extractDomain";

const VisitUrls = ({ visit }: { visit: Visit }) => {
    if (!visit.urls) return null;
    if (visit.urls?.length <= 0) return null;

    return (
        <div className="flex flex-col gap-2 mt-2">
            {visit.urls.map((url, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                    >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <a key={index} href={url} target="_blank" className="text-base text-primary underline">
                        {extractDomain(url)}
                    </a>
                </div>
            ))}
        </div>
    );
};

export default VisitUrls;
