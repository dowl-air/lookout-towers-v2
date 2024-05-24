"use client";
import React from "react";
import HR from "./hranicni_vrch.svg";
import Image from "next/image";
import { useTheme } from "next-themes";

function ComunityPage() {
    const { theme } = useTheme();
    return (
        <div>
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                Otevřeno, zavírá 20:00
            </span>
            <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
                Zavřeno
            </span>
            <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <span>Rozhledna je otevřená pouze příležitostně.</span>
            </div>
            <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
                <span>Rozhledna je označena za zaniklou.</span>
            </div>
            <div className="relative w-[290px] h-[215px] ml-10">
                <Image alt="dd" src={HR} width={290} height={215} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-500">HELLO</div>
            </div>

            <div className="card w-72 bg-base-100 shadow-xl">
                <figure className="relative">
                    <Image alt="dd" src={HR} width={270} height={200} className={`${theme !== "light" && "invert"}`} />
                    <p className="absolute text-6xl text-yellow-500 font-bold -rotate-[25deg]">Splněno</p>
                </figure>
                <div className="card-body p-6">
                    <h2 className="card-title">Dvojitá rozhledna!</h2>
                    <p>Rozhledna Hraniční vrch se pyšní svým unikátním designem!</p>
                    <div className="card-actions justify-end mt-2">
                        <button className="btn btn-primary">Zaznamenat návštěvu</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComunityPage;
