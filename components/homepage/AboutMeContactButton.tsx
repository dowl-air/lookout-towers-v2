import { Suspense } from "react";

import ContactButton from "@/components/homepage/ContactButton";
import ContactDialog from "@/components/homepage/ContactDialog";
import { verifyUser } from "@/data/auth";
import { getCurrentUser } from "@/data/user/user";

const AboutMeContactButtonSuspense = async () => {
    const { isAuth } = await verifyUser();
    const user = await getCurrentUser();

    return (
        <>
            <ContactButton isAuth={isAuth} />
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
