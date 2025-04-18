import { revalidateTowerByIDOrNameID } from "@/actions/cache/purge.tower.action";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const idResp = await revalidateTowerByIDOrNameID(id);

    return new Response(JSON.stringify({ result: idResp }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}
