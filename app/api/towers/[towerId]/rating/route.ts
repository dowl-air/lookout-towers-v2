import { NextResponse } from "next/server";

import { getTowerRatingAndCount } from "@/data/tower/towers";

export async function GET(_request: Request, { params }: { params: Promise<{ towerId: string }> }) {
    const { towerId } = await params;

    if (!towerId) {
        return NextResponse.json({ error: "Missing towerId" }, { status: 400 });
    }

    const rating = await getTowerRatingAndCount(towerId);

    return NextResponse.json(rating);
}
