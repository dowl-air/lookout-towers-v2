import AdmissionDialog from "@/components/shared/admission/AdmissionDialog";
import AdmissionButton from "@/components/tower/tiles/admission/AdmissionButton";
import { getAdmissionTariffTypeLabel, getAdmissionTypeDescription } from "@/constants/admission";
import { AdmissionType } from "@/types/Admission";
import { Tower } from "@/types/Tower";
import { getCurrency } from "@/utils/currency";

function Admission({ tower }: { tower: Tower }) {
    return (
        <div
            tabIndex={0}
            className="card card-compact sm:card-normal min-w-[300px] max-w-[calc(min(94vw,420px))] sm:h-[225px] flex-1 overflow-hidden shadow-xl group bg-[rgba(255,255,255,0.05)]"
        >
            <div className="card-body">
                <h2 className="card-title text-base sm:text-lg md:text-xl">Vstupné</h2>

                {tower ? (
                    <>
                        {tower.admission?.type === AdmissionType.FREE || tower.admission?.type === AdmissionType.DONATION ? (
                            <p className="text-base md:text-lg text-success font-bold">{getAdmissionTypeDescription(tower.admission?.type)}</p>
                        ) : null}

                        {tower.admission?.type === AdmissionType.UNKNOWN ? (
                            <p className="text-base md:text-lg text-warning font-bold">{getAdmissionTypeDescription(tower.admission?.type)}</p>
                        ) : null}

                        {!tower.admission?.type ? <p className="text-base md:text-lg text-error font-bold">Vstupné nebylo zadáno.</p> : null}

                        {tower.admission?.type === AdmissionType.PAID ? (
                            <div className="text-base md:text-lg">
                                <div className="grid grid-cols-2 gap-x-16 gap-y-1">
                                    {tower.admission?.tariffes &&
                                        Object.entries(tower.admission?.tariffes)
                                            .sort((a, b) => (a[0] === "adult" ? -1 : 1))
                                            .map(([key, value]) => {
                                                const name = getAdmissionTariffTypeLabel(key);
                                                if (!value.price || value.price <= 0) return null;
                                                return (
                                                    <span key={key} className="flex justify-between w-full">
                                                        <span>{name}:</span>
                                                        <span className="font-bold ml-1.5 whitespace-nowrap">
                                                            {value.price} {getCurrency(tower.country).symbol}
                                                        </span>
                                                    </span>
                                                );
                                            })}
                                </div>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <span className="skeleton h-6 w-full mt-3" />
                )}
            </div>
            <AdmissionButton />
            <AdmissionDialog tower={tower} />
        </div>
    );
}

export default Admission;
