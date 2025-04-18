import { revalidateTowerByIDOrNameID } from "@/actions/cache/purge.tower.action";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const idResp = revalidateTowerByIDOrNameID(id);

    return new Response(JSON.stringify(idResp), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}
