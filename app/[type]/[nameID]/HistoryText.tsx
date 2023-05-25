import React from "react";

type PageProps = {
    text: string;
};

function HistoryText({ text }: PageProps) {
    return (
        <div tabIndex={0} className="collapse collapse-arrow w-full shadow-lg rounded-box border border-secondary-focus">
            <input type="checkbox" className="peer" />
            <div className="collapse-title text-lg">Podrobný popis a historie rozhledny</div>
            <div className="collapse-content text-lg text-justify">
                <p>{text}</p>
            </div>
        </div>
    );
}

export default HistoryText;
