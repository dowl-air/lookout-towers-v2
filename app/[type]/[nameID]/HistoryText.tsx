import React from "react";

type PageProps = {
    text: string;
};

function HistoryText({ text }: PageProps) {
    return (
        <div className="collapse collapse-arrow w-full max-w-[94vw] sm:max-w-[100vw] py-1 sm:py-2 shadow-xl rounded-box bg-[rgba(255,255,255,0.05)]">
            <input type="checkbox" />
            <div className="collapse-title card-title text-base sm:text-lg md:text-xl">Podrobný popis a historie rozhledny</div>
            <div className="collapse-content text-sm sm:text-base text-justify">
                <p>{text}</p>
            </div>
        </div>
    );
}

export default HistoryText;
