import { LogIn } from "lucide-react";
import { Suspense } from "react";

import { signIn } from "@/auth";
import NavbarSideButton from "@/components/navbar/NavbarSideButton";
import { checkUser } from "@/data/auth";

const LoginLinkSuspense = async () => {
    const { isAuth } = await checkUser();
    if (isAuth) return null;

    return (
        <Suspense>
            <li className="mt-5">
                <form
                    action={async () => {
                        "use server";
                        await signIn();
                    }}
                    className="block"
                >
                    <NavbarSideButton
                        type="submit"
                        className="w-full text-left text-xl flex gap-2 items-center"
                    >
                        <LogIn />
                        Přihlásit se
                    </NavbarSideButton>
                </form>
            </li>
        </Suspense>
    );
};

const LoginLink = async () => {
    return (
        <Suspense fallback={null}>
            <LoginLinkSuspense />
        </Suspense>
    );
};

export default LoginLink;
