import { GPS } from "@/typings";
import React from "react";

type ComponentParams = {
    created: Date;
    elevation: number;
    gps: GPS;
    height: number;
    material: string[];
    modified: Date;
    opened: Date;
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
    return (
        <>
            <div
                className="card prose w-full border border-secondary-focus overflow-hidden shadow-xl transition-transform duration-200 cursor-pointer hover:scale-105"
                title="Zobrazit všechny parametry"
            >
                <label htmlFor="params-modal" className="cursor-pointer">
                    <div className="card-body items-center ">
                        <table className="table-compact w-full my-2">
                            <tbody>
                                <tr>
                                    <th>Materiál</th>
                                    <td>
                                        {params.material.map((item, idx) => (
                                            <div className="badge badge-outline" key={idx}>
                                                {item}
                                            </div>
                                        ))}
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
                                    <td>{params.opened.toLocaleDateString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </label>
            </div>

            {/* Put this part before </body> tag */}
            <input type="checkbox" id="params-modal" className="modal-toggle" />
            <label htmlFor="params-modal" className="modal cursor-pointer sm:modal-middle">
                <label className="modal-box relative" htmlFor="">
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
                                        {params.material.map((item, idx) => (
                                            <div className="badge badge-outline" key={idx}>
                                                {item}
                                            </div>
                                        ))}
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
                                    <td>{params.opened.toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <th>Nadmořská výška</th>
                                    <td>{params.elevation.toString() + " m. n. m."}</td>
                                </tr>
                                <tr>
                                    <th>Souřadnice</th>
                                    <td>{params.gps.longitude.toString() + "E " + params.gps.latitude.toString() + "N"}</td>
                                </tr>
                                <tr>
                                    <th>Naposledy upraveno</th>
                                    <td>{params.modified.toLocaleDateString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-action">
                        <label htmlFor="params-modal" className="btn btn-warning btn-sm">
                            Navrhnout úpravu
                        </label>
                    </div>
                </label>
            </label>
        </>
    );
}

export default Parameters;
