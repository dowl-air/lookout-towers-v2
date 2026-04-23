"use client";

const FooterCopyright = () => {
    const year = new Date().getFullYear();

    return <p>&copy; {year} Rozhlednový svět. Všechna práva vyhrazena.</p>;
};

export default FooterCopyright;
