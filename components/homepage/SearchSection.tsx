import HeroSearch from "@/components/homepage/HeroSearch";

function SearchSection() {
    return (
        <section className="mx-auto mt-8 w-full max-w-[980px] px-4 md:mt-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <HeroSearch />
            </div>
        </section>
    );
}

export default SearchSection;
