import { ReactNode } from "react";

const InfoIcon = ({ tooltipText }: { tooltipText?: string }) => {
    return (
        <div className="tooltip" data-tip={tooltipText}>
            <button className="btn btn-circle btn-outline font-serif font-bold w-6 min-h-6 h-6">i</button>
        </div>
    );
};

export default InfoIcon;
