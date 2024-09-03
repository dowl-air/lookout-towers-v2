import { checkAuth } from "@/actions/checkAuth";
import { signIn } from "@/auth";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const user = await checkAuth();
    if (!user) return await signIn();
    return <>{children}</>;
}
