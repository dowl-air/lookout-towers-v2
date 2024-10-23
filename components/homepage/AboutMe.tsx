import Image from "next/image";
import ContactButton from "@/components/homepage/ContactButton";
import ContactDialog from "@/components/homepage/ContactDialog";
import { checkAuth } from "@/actions/checkAuth";

async function AboutMe() {
    const user = await checkAuth();
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
                <h2 className="font-bold text-2xl mt-8 text-primary-content">Ahoj, já jsem Daniel</h2>
                <p className="mt-8 px-4 text-center text-primary-content">
                    Miluju jízdu na kole, rozhledny a sovy. V současnosti studuji Informační technologie na vysoké škole a jsem autor tohoto webu.
                </p>
                <div className="flex mt-10 flex-row gap-3">
                    <a href="https://www.facebook.com/dp9898" target="_blank" rel="noreferrer" aria-label="Facebook">
                        <svg
                            height="800px"
                            width="800px"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="-143 145 512 512"
                            className="w-8 h-8 text-primary-content"
                            fill="currentColor"
                        >
                            <g>
                                <path
                                    d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M272.8,560.7
		c-20.8,20.8-44.9,37.1-71.8,48.4c-27.8,11.8-57.4,17.7-88,17.7c-30.5,0-60.1-6-88-17.7c-26.9-11.4-51.1-27.7-71.8-48.4
		c-20.8-20.8-37.1-44.9-48.4-71.8C-107,461.1-113,431.5-113,401s6-60.1,17.7-88c11.4-26.9,27.7-51.1,48.4-71.8
		c20.9-20.8,45-37.1,71.9-48.5C52.9,181,82.5,175,113,175s60.1,6,88,17.7c26.9,11.4,51.1,27.7,71.8,48.4
		c20.8,20.8,37.1,44.9,48.4,71.8c11.8,27.8,17.7,57.4,17.7,88c0,30.5-6,60.1-17.7,88C309.8,515.8,293.5,540,272.8,560.7z"
                                />
                                <path
                                    d="M146.8,313.7c10.3,0,21.3,3.2,21.3,3.2l6.6-39.2c0,0-14-4.8-47.4-4.8c-20.5,0-32.4,7.8-41.1,19.3
		c-8.2,10.9-8.5,28.4-8.5,39.7v25.7H51.2v38.3h26.5v133h49.6v-133h39.3l2.9-38.3h-42.2v-29.9C127.3,317.4,136.5,313.7,146.8,313.7z"
                                />
                            </g>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/dowl.air/" target="_blank" rel="noreferrer" aria-label="Instagram">
                        <svg
                            height="800px"
                            width="800px"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="-143 145 512 512"
                            className="w-8 h-8 text-primary-content"
                            fill="currentColor"
                        >
                            <g>
                                <path
                                    d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M272.8,560.7
		c-20.8,20.8-44.9,37.1-71.8,48.4c-27.8,11.8-57.4,17.7-88,17.7c-30.5,0-60.1-6-88-17.7c-26.9-11.4-51.1-27.7-71.8-48.4
		c-20.8-20.8-37.1-44.9-48.4-71.8C-107,461.1-113,431.5-113,401s6-60.1,17.7-88c11.4-26.9,27.7-51.1,48.4-71.8
		c20.9-20.8,45-37.1,71.9-48.5C52.9,181,82.5,175,113,175s60.1,6,88,17.7c26.9,11.4,51.1,27.7,71.8,48.4
		c20.8,20.8,37.1,44.9,48.4,71.8c11.8,27.8,17.7,57.4,17.7,88c0,30.5-6,60.1-17.7,88C309.8,515.8,293.5,540,272.8,560.7z"
                                />
                                <path
                                    d="M191.6,273h-157c-27.3,0-49.5,22.2-49.5,49.5v52.3v104.8c0,27.3,22.2,49.5,49.5,49.5h157c27.3,0,49.5-22.2,49.5-49.5V374.7
		v-52.3C241,295.2,218.8,273,191.6,273z M205.8,302.5h5.7v5.6v37.8l-43.3,0.1l-0.1-43.4L205.8,302.5z M76.5,374.7
		c8.2-11.3,21.5-18.8,36.5-18.8s28.3,7.4,36.5,18.8c5.4,7.4,8.5,16.5,8.5,26.3c0,24.8-20.2,45.1-45.1,45.1C88,446.1,68,425.8,68,401
		C68,391.2,71.2,382.1,76.5,374.7z M216.1,479.5c0,13.5-11,24.5-24.5,24.5h-157c-13.5,0-24.5-11-24.5-24.5V374.7h38.2
		c-3.3,8.1-5.2,17-5.2,26.3c0,38.6,31.4,70,70,70c38.6,0,70-31.4,70-70c0-9.3-1.9-18.2-5.2-26.3h38.2V479.5z"
                                />
                            </g>
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/dowl/" target="_blank" rel="noreferrer" aria-label="Linkedin">
                        <svg
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="-143 145 512 512"
                            className="w-8 h-8 text-primary-content"
                            fill="currentColor"
                        >
                            <g>
                                <path
                                    d="M113,145c-141.4,0-256,114.6-256,256s114.6,256,256,256s256-114.6,256-256S254.4,145,113,145z M272.8,560.7
		c-20.8,20.8-44.9,37.1-71.8,48.4c-27.8,11.8-57.4,17.7-88,17.7c-30.5,0-60.1-6-88-17.7c-26.9-11.4-51.1-27.7-71.8-48.4
		c-20.8-20.8-37.1-44.9-48.4-71.8C-107,461.1-113,431.5-113,401s6-60.1,17.7-88c11.4-26.9,27.7-51.1,48.4-71.8
		c20.9-20.8,45-37.1,71.9-48.5C52.9,181,82.5,175,113,175s60.1,6,88,17.7c26.9,11.4,51.1,27.7,71.8,48.4
		c20.8,20.8,37.1,44.9,48.4,71.8c11.8,27.8,17.7,57.4,17.7,88c0,30.5-6,60.1-17.7,88C309.8,515.8,293.5,540,272.8,560.7z"
                                />
                                <rect x="-8.5" y="348.4" width="49.9" height="159.7" />
                                <path
                                    d="M15.4,273c-18.4,0-30.5,11.9-30.5,27.7c0,15.5,11.7,27.7,29.8,27.7h0.4c18.8,0,30.5-12.3,30.4-27.7
		C45.1,284.9,33.8,273,15.4,273z"
                                />
                                <path
                                    d="M177.7,346.9c-28.6,0-46.5,15.6-49.8,26.6v-25.1H71.8c0.7,13.3,0,159.7,0,159.7h56.1v-86.3c0-4.9-0.2-9.7,1.2-13.1
		c3.8-9.6,12.1-19.6,27-19.6c19.5,0,28.3,14.8,28.3,36.4v82.6H241v-88.8C241,369.9,213.2,346.9,177.7,346.9z"
                                />
                            </g>
                        </svg>
                    </a>
                </div>
            </div>
            <div className="flex-1 max-w-[500px] h-full flex flex-col items-center sm:items-start mb-10">
                <h2 className="text-3xl md:text-4xl mt-5">O tomto webu</h2>
                <article className="mt-4 md:mt-5 text-center sm:text-left">
                    Rozhlednový svět je komunitní databáze vyhlídkových věží, pozorovatelen a dalších objektů určených k objevování krásných výhledů.
                    Tento web jsem vytvořil z důvodu bližšího propojení milovníků rozhleden, ke kterým samozřejmě patřím i já. Cílem tohoto webu je
                    zmapovat všechny rozhledny v Česku (zatím), ukládat o nich aktuální informace, které budou všem volně dostupné, a v neposlední
                    řadě umožnit uživatelům uchovat své návštěvy a vzpomínky.
                </article>
                <div className="flex justify-start mt-6 md:mt-10">
                    <ContactButton user={user} />
                    <ContactDialog user={user} />
                </div>
            </div>
        </div>
    );
}

export default AboutMe;
