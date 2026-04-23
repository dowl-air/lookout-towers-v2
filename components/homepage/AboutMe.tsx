import Image from "next/image";

import AboutMeContactButton from "@/components/homepage/AboutMeContactButton";

async function AboutMe() {
    return (
        <div className="flex justify-center sm:justify-start px-4 max-w-7xl gap-5 md:gap-10 mx-auto mt-32 md:mt-36 flex-wrap sm:flex-nowrap mb-10">
            <div className="w-full mx-auto sm:w-72 md:w-80 h-[400px] bg-primary flex items-center rounded-lg flex-col">
                <div className="w-[180px] h-[180px] overflow-hidden rounded-full mt-[-90px] ">
                    <Image
                        alt="Selfie of web author."
                        className="w-[180px] h-[180px]"
                        src="/img/me.jpg"
                        width={2248}
                        height={2249}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    />
                </div>
                <h2 className="font-bold text-2xl mt-8 text-primary-content">
                    Ahoj, já jsem Daniel
                </h2>
                <p className="mt-8 px-4 text-center text-primary-content">
                    Miluju rozhledny, jízdu na kole a stavění užitečných webů. Tenhle projekt vznikl
                    proto, aby šlo místa s výhledem lépe objevovat i plánovat.
                </p>
            </div>
            <div className="flex-1 max-w-[500px] flex flex-col items-center sm:items-start mb-10">
                <h2 className="text-3xl md:text-4xl mt-5">O tomto webu</h2>
                <article className="mt-4 md:mt-5 text-center sm:text-left">
                    Rozhlednový svět je komunitní databáze vyhlídkových věží, pozorovatelen a
                    dalších objektů určených k objevování krásných výhledů. Tento web jsem vytvořil
                    z důvodu bližšího propojení milovníků rozhleden, ke kterým samozřejmě patřím i
                    já. Cílem tohoto webu je zmapovat všechny rozhledny v Česku (zatím), ukládat o
                    nich aktuální informace, které budou všem volně dostupné, a v neposlední řadě
                    umožnit uživatelům uchovat své návštěvy a vzpomínky.
                </article>
                <div className="flex justify-start mt-6 md:mt-10">
                    <AboutMeContactButton />
                </div>
            </div>
        </div>
    );
}

export default AboutMe;
