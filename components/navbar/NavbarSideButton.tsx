"use client";

interface NavbarSideButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NavbarSideButton = ({ children, ...props }: NavbarSideButtonProps) => {
    const closeDrawer = () => {
        const elm = document.querySelector("#side-drawer") as HTMLInputElement;
        if (elm !== undefined) elm.checked = false;
    };

    return (
        <button onClick={closeDrawer} {...props}>
            {children}
        </button>
    );
};

export default NavbarSideButton;
