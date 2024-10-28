"use client";

const CloseButton = () => {
    return (
        <button className="btn btn-error btn-sm" onClick={() => (document.getElementById("parameters-modal") as HTMLDialogElement).close()}>
            Zavřít
        </button>
    );
};

export default CloseButton;
