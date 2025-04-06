"use client";

import { checkAuth } from "@/actions/checkAuth";
import AdmissionDialog from "@/components/shared/admission/AdmissionDialog";
import { getAdmissionTariffTypeLabel, getAdmissionTypeDescription } from "@/constants/admission";
import { AdmissionType } from "@/types/Admission";
import { Tower } from "@/types/Tower";
import { getCurrency } from "@/utils/currency";
import { useRouter } from "next/navigation";

function Admission({ tower }: { tower: Tower }) {
    const router = useRouter();

    return (
        <div className="card card-compact sm:card-normal min-w-[300px] max-w-[calc(min(94vw,420px))] sm:h-[225px] flex-1 overflow-hidden shadow-xl group bg-[rgba(255,255,255,0.05)]">
            <div className="card-body">
                <h2 className="card-title text-base sm:text-lg md:text-xl">Vstupné</h2>

                {tower?.admission?.type === AdmissionType.FREE || tower?.admission?.type === AdmissionType.DONATION ? (
                    <p className="text-base md:text-lg text-success font-bold">{getAdmissionTypeDescription(tower?.admission?.type)}</p>
                ) : null}

                {tower?.admission?.type === AdmissionType.UNKNOWN ? (
                    <p className="text-base md:text-lg text-warning font-bold">{getAdmissionTypeDescription(tower?.admission?.type)}</p>
                ) : null}

                {!tower?.admission?.type ? <p className="text-base md:text-lg text-error font-bold">Vstupné nebylo zadáno.</p> : null}

                {tower?.admission?.type === AdmissionType.PAID ? (
                    <div className="text-base md:text-lg">
                        <p className="text-base md:text-lg font-bold mb-2">{getAdmissionTypeDescription(tower?.admission?.type)}</p>
                        <div className="grid grid-cols-2 gap-x-3">
                            {tower?.admission?.tariffes &&
                                Object.entries(tower?.admission?.tariffes).map(([key, value]) => {
                                    const name = getAdmissionTariffTypeLabel(key);
                                    if (!value.price || value.price <= 0) return null;
                                    return (
                                        <span key={key}>
                                            {name}:
                                            <span className="font-bold ml-1.5 whitespace-nowrap">
                                                {value.price} {getCurrency(tower.country).symbol}
                                            </span>
                                        </span>
                                    );
                                })}
                        </div>
                    </div>
                ) : null}
            </div>
            <div
                className="btn btn-xs btn-warning sm:btn-sm hidden absolute top-[0.1rem] right-[0.5rem] group-hover:inline-flex"
                onClick={async () => {
                    if (!(await checkAuth())) {
                        return router.push("/signin");
                    }
                    (document.getElementById("admission_modal") as HTMLDialogElement)?.showModal();
                }}
            >
                Navrhnout úpravu
            </div>
            <AdmissionDialog tower={tower} />
        </div>
    );
}

export default Admission;
