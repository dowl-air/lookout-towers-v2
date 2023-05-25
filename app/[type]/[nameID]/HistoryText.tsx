import React from "react";

type PageProps = {
    text: string;
};

function HistoryText({ text }: PageProps) {
    return (
        <div tabIndex={0} className="collapse collapse-arrow border border-base-content rounded-md w-full mx-auto">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-xl font-bold">Podrobný popis a historie rozhledny</div>
            <div className="collapse-content text-lg text-justify">
                <p>{text}</p>
            </div>
        </div>
    );
}

export default HistoryText;
