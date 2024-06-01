"use client";
import { closeDrawer } from "@/utils/closeDrawer";

interface NavbarSideButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NavbarSideButton = ({ children, ...props }: NavbarSideButtonProps) => {
    return (
        <button onClick={closeDrawer} {...props}>
            {children}
        </button>
    );
};

export default NavbarSideButton;
