import React from "react";

type Props = {};

const Buttons = (props: Props) => {
    return (
        <>
            {false ? (
                <div className="btn btn-success w-1/2 mt-7 [&>span]:hover:hidden hover:before:content-['Odebrat_z_oblíbených'] hover:btn-warning ">
                    <span>V oblíbených</span>
                </div>
            ) : (
                <div className="btn btn-primary max-w-xs text-xs min-[710px]:text-base">Přidat do oblíbených</div>
            )}
            {false ? (
                <div className="btn btn-success w-1/2 mt-3 mb-5 [&>span]:hover:hidden hover:before:content-['Upravit_návštěvu'] hover:btn-warning ">
                    <span>V navštívených</span>
                </div>
            ) : (
                <div className="btn btn-primary max-w-xs text-xs min-[710px]:text-base">Zaznamenat návštěvu</div>
            )}
        </>
    );
};

export default Buttons;
