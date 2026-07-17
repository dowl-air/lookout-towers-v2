export function createNameID(name: string) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("cs-CZ")
        .replace(/ /g, "_");
}

type NameIDExists = (nameID: string) => Promise<boolean>;

export async function resolveUniqueNameID(
    name: string,
    county: string | undefined,
    nameIDExists: NameIDExists
) {
    const baseNameID = createNameID(name);
    const candidates = [baseNameID];
    const countyNameID = county ? createNameID(county) : "";

    if (countyNameID) {
        candidates.push(`${baseNameID}_${countyNameID}`);
    }

    for (const candidate of candidates) {
        if (!(await nameIDExists(candidate))) return candidate;
    }

    for (let suffix = 2; ; suffix += 1) {
        const candidate = `${baseNameID}_${suffix}`;

        if (!(await nameIDExists(candidate))) return candidate;
    }
}
