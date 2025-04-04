import EditButton from "@/components/tower/tiles/parameters/dialog/EditButton";
import ParametersEditDialog from "@/components/tower/tiles/parameters/ParametersEditDialog";
import ParameterTile from "@/components/tower/tiles/parameters/ParameterTile";
import { Tower } from "@/types/Tower";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/date";
import { generateHeightText } from "@/utils/texts";

function Parameters({ tower }: { tower: Tower }) {
    return (
        <>
            <ParameterTile>
                <div className="card-body items-center">
                    <table className="table-compact my-2 table-fixed">
                        <tbody>
                            <tr>
                                <td className="font-bold text-right">Materiál</td>
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
                                <td className="font-bold text-right">Počet schodů</td>
                                <td>{tower.stairs}</td>
                            </tr>
                            <tr>
                                <td className="font-bold text-right">Výška</td>
                                <td>{generateHeightText(tower.height)}</td>
                            </tr>
                            <tr>
                                <td className="font-bold text-right">Zpřístupnění</td>
                                <td>{tower.opened ? formatDate({ date: tower.opened, long: true }) : "neznámé"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ParameterTile>

            <dialog className="modal modal-bottom sm:modal-middle" id="parameters-modal">
                <div className="modal-box">
                    <h3 className="text-lg font-bold text-center">Parametry</h3>
                    <div className="prose items-center">
                        <table className="table-compact w-full my-4 table-fixed">
                            <tbody>
                                <tr>
                                    <td className="text-right font-bold">Název</td>
                                    <td>{tower.name}</td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Typ</td>
                                    <td>{tower.type}</td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Materiál</td>
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
                                    <td className="text-right font-bold">Počet schodů</td>
                                    <td>{tower.stairs}</td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Počet vyhlídkových plošin</td>
                                    <td
                                        className={cn({
                                            "text-error font-bold": !tower.observationDecksCount || tower.viewHeight < 0,
                                        })}
                                    >
                                        {tower.observationDecksCount >= 0 ? tower.observationDecksCount : "neznámý počet"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Výška rozhledny</td>
                                    <td>{generateHeightText(tower.height)}</td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Výška výhledu</td>
                                    <td
                                        className={cn({
                                            "text-error font-bold": !tower.viewHeight || tower.viewHeight < 0,
                                        })}
                                    >
                                        {generateHeightText(tower.viewHeight)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Zpřístupnění</td>
                                    <td>{tower.opened ? formatDate({ date: tower.opened, long: true }) : "neznámé"}</td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Nadmořská výška</td>
                                    <td>{`${tower.elevation} m. n. m.`}</td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Souřadnice</td>
                                    <td>{`${tower.gps.longitude.toFixed(6)}E ${tower.gps.latitude.toFixed(6)}N`}</td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Vlastník</td>
                                    <td
                                        className={cn({
                                            "text-error font-bold": !tower.owner,
                                        })}
                                    >
                                        {tower.owner ? tower.owner : "neznámý vlastník"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-right font-bold">Naposledy upraveno</td>
                                    <td>{tower.modified ? formatDate({ date: tower.modified, long: true }) : "nebylo"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-action">
                        <form method="dialog" className="mr-auto">
                            <button className="btn btn-error">Zavřít</button>
                        </form>
                        <EditButton />
                    </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>zavřít</button>
                </form>
            </dialog>

            <ParametersEditDialog tower={tower} />
        </>
    );
}

export default Parameters;
