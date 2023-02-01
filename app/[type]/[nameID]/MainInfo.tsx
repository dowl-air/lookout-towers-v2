import React from "react";

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

type PageProps = {
    name: string;
    county: string;
    country: string;
    province: string;
    type: string;
    stairs: number;
    height: number;
    openingHours: string;
    elevation: number;
};

function MainInfo({ name, country, county, province, stairs, height, type, elevation, openingHours }: PageProps) {
    return (
        <div className="prose prose-xl max-w-screen-sm flex flex-col flex-1 pl-4">
            <div className="text-sm breadcrumbs mt-3">
                <ul className="pl-4">
                    <li>
                        <a>{country}</a>
                    </li>
                    <li>
                        <a>{province}</a>
                    </li>
                    <li>
                        <a>{county}</a>
                    </li>
                </ul>
            </div>
            <h1>{name}</h1>
            <legend>{`${capitalizeFirstLetter(type)} je vysoká ${height === -1 ? "neznámo" : height} metrů a vede na ni ${
                stairs === -1 ? "neznámo" : "přesně " + stairs
            } schodů. Nachází se v nadmořské výšce ${elevation} metrů a ${openingHours === "volně přístupná" ? "je volně přístupná" : ""}${
                openingHours === "dlouhodobě uzavřená" ? "je bohužel dlouhodobě uzavřená" : ""
            }${"dlouhodobě uzavřená" !== openingHours && openingHours !== "volně přístupná" ? "její otevírací doba není známa" : ""}.`}</legend>

            <div className="rating rating-lg mt-9">
                <input type="radio" name="rating-8" className="mask mask-star-2 bg-primary" />
                <input type="radio" name="rating-8" className="mask mask-star-2" />
                <input type="radio" name="rating-8" className="mask mask-star-2" />
                <input type="radio" name="rating-8" className="mask mask-star-2" />
                <input type="radio" name="rating-8" className="mask mask-star-2" />
            </div>
            <p className="text-sm mt-0 pl-1">Zatím nikdo nehodnotil.</p>

            {false ? (
                <div className="btn btn-success w-1/2 mt-9 [&>span]:hover:hidden hover:before:content-['Odebrat_z_oblíbených'] hover:btn-warning ">
                    <span>V oblíbených</span>
                </div>
            ) : (
                <div className="btn btn-secondary w-1/2 mt-9">Přidat do oblíbených</div>
            )}
            {false ? (
                <div className="btn btn-success w-1/2 mt-3 [&>span]:hover:hidden hover:before:content-['Upravit_návštěvu'] hover:btn-warning ">
                    <span>V navštívených</span>
                </div>
            ) : (
                <div className="btn btn-secondary w-1/2 mt-3">Zaznamenat návštěvu</div>
            )}
        </div>
    );
}

export default MainInfo;
