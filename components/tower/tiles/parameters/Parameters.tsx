"use client";
import { GPS } from "@/typings";

type ComponentParams = {
    elevation: number;
    gps: GPS;
    height: number;
    material: string[];
    modified: Date | string;
    opened: Date | string;
    type: string;
    stairs: number;
};

const generateHeightText = (height: number): string => {
    const textValue = height.toString();
    if (height < 0) return "neznámá výška";
    if (height == 0) return "0 metrů";
    if (height == 1) return "1 metr";
    if (height > 1 && height < 5) return textValue + " metry";
    return textValue + " metrů";
};

function Parameters(params: ComponentParams) {
    console.log(params);
    return (
        <>
            <div
                className={`card card-compact sm:card-normal prose min-w-[300px] max-w-[calc(min(94vw,420px))] sm:h-[225px] flex-1 overflow-hidden shadow-xl bg-[rgba(255,255,255,0.05)] transition-transform duration-200 cursor-pointer hover:scale-105`}
                title="Zobrazit všechny parametry"
                onClick={() => (document.getElementById("parameters-modal") as HTMLDialogElement).showModal()}
            >
                <div className="card-body items-center">
                    <table className="table-compact my-2">
                        <tbody>
                            <tr>
                                <th className="text-base-content">Materiál</th>
                                <td>
                                    <div className="flex flex-wrap gap-1">
                                        {params.material.map((item, idx) => (
                                            <div className="badge badge-outline text-xs" key={idx}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th className="text-base-content">Počet schodů</th>
                                <td>{params.stairs.toString()}</td>
                            </tr>
                            <tr>
                                <th className="text-base-content">Výška</th>
                                <td>{generateHeightText(params.height)}</td>
                            </tr>
                            <tr>
                                <th className="text-base-content">Zpřístupnění</th>
                                <td>{params.opened ? new Date(params.opened).toLocaleDateString("cs") : "neznámé"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <dialog className="modal modal-bottom sm:modal-middle" id="parameters-modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Parametry</h3>
                    <div className="prose items-center ">
                        <table className="table-compact w-full my-4">
                            <tbody>
                                <tr>
                                    <th>Typ</th>
                                    <td>{params.type}</td>
                                </tr>
                                <tr>
                                    <th>Materiál</th>
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {params.material.map((item, idx) => (
                                                <div className="badge badge-outline" key={idx}>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Počet schodů</th>
                                    <td>{params.stairs.toString()}</td>
                                </tr>
                                <tr>
                                    <th>Výška</th>
                                    <td>{generateHeightText(params.height)}</td>
                                </tr>
                                <tr>
                                    <th>Zpřístupnění</th>
                                    <td>{params.opened ? new Date(params.opened).toLocaleDateString("cs") : "neznámé"}</td>
                                </tr>
                                <tr>
                                    <th>Nadmořská výška</th>
                                    <td>{params.elevation.toString() + " m. n. m."}</td>
                                </tr>
                                <tr>
                                    <th>Souřadnice</th>
                                    <td>{`${params.gps.longitude.toFixed(6)}E ${params.gps.latitude.toFixed(6)}N`}</td>
                                </tr>
                                {/* <tr>
                                    <th>Naposledy upraveno</th>
                                    <td>{params.modified ? new Date(params.modified).toLocaleDateString("cs") : "nebylo"}</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-warning btn-sm mr-auto">Navrhnout úpravu</button>
                        <button
                            className="btn btn-error btn-sm"
                            onClick={() => (document.getElementById("parameters-modal") as HTMLDialogElement).close()}
                        >
                            Zavřít
                        </button>
                    </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>zavřít</button>
                </form>
            </dialog>
        </>
    );
}

export default Parameters;
