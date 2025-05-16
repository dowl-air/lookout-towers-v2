import { loginRedirect } from "@/actions/login.redirect";
import Admission from "@/components/tower/tiles/Admission";
import HistoryText from "@/components/tower/tiles/HistoryText";
import OpeningHoursTile from "@/components/tower/tiles/openingHours/OpeningHoursTile";
import ParameterTile from "@/components/tower/tiles/parameters/ParameterTile";

const Loading = () => {
    return (
        <div className="flex flex-col px-4 w-full">
            <div className="max-w-(--breakpoint-xl) w-full flex flex-col items-center lg:items-start lg:justify-between lg:flex-row mx-auto">
                <div className="w-full prose sm:prose-xl max-w-(--breakpoint-sm) flex flex-col items-center lg:items-start flex-1 mt-7 lg:pl-2">
                    <div className="skeleton w-64 h-8 mt-5" />
                    <h1 className="skeleton w-96 h-14 mt-6 sm:mt-10 lg:mb-8 max-w-full"></h1>
                    <div className="skeleton w-[600px] h-9 max-w-full" />
                    <div className="skeleton w-[400px] h-9 mt-5 max-w-full" />
                    <div className="skeleton w-56 h-16 my-10" />
                    <div className="flex flex-col gap-2">
                        <form action={loginRedirect} className="flex flex-row lg:flex-col justify-center gap-2 flex-wrap">
                            <button type="submit" className="btn btn-primary max-w-xs lg:min-w-64 text-sm min-[710px]:text-base">
                                Přidat do oblíbených
                            </button>
                            <button type="submit" className="btn btn-primary max-w-xs lg:min-w-64 text-sm min-[710px]:text-base">
                                Zaznamenat návštěvu
                            </button>
                        </form>
                    </div>
                </div>
                <div className="flex flex-col mb-7 w-full md:w-[560px] xl:w-[600px]">
                    <figure className="h-72 sm:h-80 md:h-96 mt-10 mb-2">
                        <div className="flex h-72 sm:h-80 md:h-96 w-full justify-center items-center">
                            <div className="skeleton w-full h-full rounded-xl mx-20" />
                        </div>
                    </figure>

                    <div
                        className="h-28 w-auto p-1 flex overflow-x-hidden overflow-y-visible gap-2 my-3"
                        style={{
                            maskImage: "linear-gradient(to right, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0) 96%)",
                        }}
                    >
                        {[...Array(5)].map((image, idx) => {
                            return <div key={idx} className="skeleton w-28 h-[104px]" />;
                        })}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 items-center justify-center self-center mx-1 sm:mx-3 flex-1 max-w-(--breakpoint-xl) w-full mb-20">
                <div className="flex flex-wrap gap-3 w-full items-center justify-center">
                    <OpeningHoursTile tower={null} />
                    <Admission tower={null} />
                    <ParameterTile>
                        <div className="card-body items-center">
                            <table className="table-compact my-2 table-fixed">
                                <tbody>
                                    <tr>
                                        <td className="font-bold text-right">Materiál</td>
                                        <td>
                                            <div className="skeleton w-36 h-3" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-right">Počet schodů</td>
                                        <td>
                                            <div className="skeleton w-16 h-3" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-right">Výška</td>
                                        <td>
                                            <div className="skeleton w-20 h-3" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-bold text-right">Zpřístupnění</td>
                                        <td>
                                            <div className="skeleton w-28 h-3" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ParameterTile>
                </div>
                <HistoryText text="" />
            </div>
        </div>
    );
};

export default Loading;
