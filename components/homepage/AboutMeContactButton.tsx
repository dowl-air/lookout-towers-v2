import { Suspense } from "react";

import ContactButton from "@/components/homepage/ContactButton";
import ContactDialog from "@/components/homepage/ContactDialog";
import { checkUser } from "@/data/auth";
import { getCurrentUser } from "@/data/user/user";

const AboutMeContactButtonSuspense = async () => {
    const { isAuth } = await checkUser();
    if (isAuth === false) {
        return (
            <>
                <ContactButton isAuth={false} />
            </>
        );
    }

    const user = await getCurrentUser();
    return (
        <>
            <ContactButton isAuth />
            {isAuth ? <ContactDialog user={user} /> : null}
        </>
    );
};

const AboutMeContactButton = () => {
    return (
        <Suspense fallback={null}>
            <AboutMeContactButtonSuspense />
        </Suspense>
    );
};

export default AboutMeContactButton;
