import { auth, signIn } from "@/auth";
import ProfileIconButton from "@/components/navbar/ProfileIconButton";

const NavbarUser = async () => {
    const session = await auth();
    return (
        <>
            {session?.user ? (
                <ProfileIconButton />
            ) : (
                <form
                    action={async () => {
                        "use server";
                        await signIn();
                    }}
                >
                    <button type="submit" className="btn btn-sm btn-primary ml-3 md:btn-md">
                        Přihlásit se
                    </button>
                </form>
            )}
        </>
    );
};

export default NavbarUser;
