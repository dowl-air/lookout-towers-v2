type AccessType = "walk" | "bike" | "car" | "train" | "bus" | "cable-car" | "other" | "unknown";
type TouristColor = "green" | "yellow" | "blue" | "red" | "nocolor" | "cyclePath";
type Difficulty = "easy" | "medium" | "hard" | "unknown";

const simpleAcess = [
    {
        type: ["bus", "car"],
        touristColor: ["green"],
        description: "Pěšky po zelené z obce Radošov.",
        distance: 1.5,
        duration: 30,
        difficulty: "easy",
    },
    {
        type: ["car"],
        description: "Parkoviště u rozhledny.",
        distance: 0.1,
        duration: 0,
        difficulty: "easy",
    },
    {
        type: ["car", "train"],
        touristColor: ["blue"],
        description: "Po modré z obce Bystřice.",
        distance: 2.5,
        duration: 60,
        difficulty: "medium",
    },
];

function Admission() {
    return (
        <div
            className={`card card-compact sm:card-normal min-w-[300px] max-w-[calc(min(94vw,420px))] sm:h-[225px] flex-1 overflow-hidden shadow-xl group bg-[rgba(255,255,255,0.05)]`}
        >
            <div className="card-body">
                <h2 className="card-title text-base sm:text-lg md:text-xl">Přístup</h2>
                <p className="text-base md:text-lg text-success font-bold">Bezplatný vstup.</p>
                {/* <p className="text-base md:text-lg text-nowrap">
                    Zpoplatněno: <b>60 Kč</b>
                </p> */}
                <p></p>
            </div>
            <div className="btn btn-xs btn-warning sm:btn-sm hidden absolute top-[0.1rem] right-[0.5rem] group-hover:inline-flex">
                Navrhnout úpravu
            </div>
        </div>
    );
}

export default Admission;
