"use client";
import React from "react";
import { signIn } from "next-auth/react";

function LoginButton() {
    return (
        <button
            onClick={() => {
                signIn();
            }}
            className="btn btn-sm btn-primary ml-3 md:btn-md"
        >
            Přihlášení
        </button>
    );
}

export default LoginButton;
