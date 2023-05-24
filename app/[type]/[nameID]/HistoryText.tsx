import React from "react";

type PageProps = {
    text: string;
};

function HistoryText({ text }: PageProps) {
    return (
        <div tabIndex={0} className="prose-xl collapse collapse-arrow border border-base-300 rounded-box w-full bg-secondary-content">
            <input type="checkbox" className="peer" />
            <div className="collapse-title">Podrobný popis a historie rozhledny</div>
            <div className="collapse-content">
                <p>{text}</p>
            </div>
        </div>
    );
}

export default HistoryText;
