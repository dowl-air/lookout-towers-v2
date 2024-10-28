import { Tower } from "@/typings";
import CloseButton from "@/components/tower/tiles/parameters/dialog/CloseButton";
import ParameterTile from "@/components/tower/tiles/parameters/ParameterTile";
import { formatDate } from "@/utils/date";
import { generateHeightText } from "@/utils/texts";

function Parameters({ tower }: { tower: Tower }) {
    return (
        <>
            <ParameterTile>
                <div className="card-body items-center">
                    <table className="table-compact my-2">
                        <tbody>
                            <tr>
                                <th className="text-base-content">Materiál</th>
                                <td>
                                    <div className="flex flex-wrap gap-1">
                                        {tower.material?.map((item, idx) => (
                                            <div className="badge badge-outline text-xs" key={idx}>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th className="text-base-content">Počet schodů</th>
                                <td>{tower.stairs}</td>
                            </tr>
                            <tr>
                                <th className="text-base-content">Výška</th>
                                <td>{generateHeightText(tower.height)}</td>
                            </tr>
                            <tr>
                                <th className="text-base-content">Zpřístupnění</th>
                                <td>{tower.opened ? formatDate({ date: tower.opened, long: true }) : "neznámé"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ParameterTile>

            <dialog className="modal modal-bottom sm:modal-middle" id="parameters-modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Parametry</h3>
                    <div className="prose items-center ">
                        <table className="table-compact w-full my-4">
                            <tbody>
                                <tr>
                                    <th>Typ</th>
                                    <td>{tower.type}</td>
                                </tr>
                                <tr>
                                    <th>Materiál</th>
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {tower.material?.map((item, idx) => (
                                                <div className="badge badge-outline" key={idx}>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Počet schodů</th>
                                    <td>{tower.stairs}</td>
                                </tr>
                                <tr>
                                    <th>Výška</th>
                                    <td>{generateHeightText(tower.height)}</td>
                                </tr>
                                <tr>
                                    <th>Zpřístupnění</th>
                                    <td>{tower.opened ? formatDate({ date: tower.opened, long: true }) : "neznámé"}</td>
                                </tr>
                                <tr>
                                    <th>Nadmořská výška</th>
                                    <td>{`${tower.elevation} m. n. m.`}</td>
                                </tr>
                                <tr>
                                    <th>Souřadnice</th>
                                    <td>{`${tower.gps.longitude.toFixed(6)}E ${tower.gps.latitude.toFixed(6)}N`}</td>
                                </tr>
                                <tr>
                                    <th>Naposledy upraveno</th>
                                    <td>{tower.modified ? formatDate({ date: tower.modified, long: true }) : "nebylo"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-warning btn-sm mr-auto">Navrhnout úpravu</button>
                        <CloseButton />
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
