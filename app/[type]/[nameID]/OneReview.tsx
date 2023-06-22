"use client";
import React from "react";
import { Rating } from "react-simple-star-rating";

type Props = {};

function OneReview({}: Props) {
    //const colors = useThemeColors();
    return (
        <div className="flex flex-col gap-2 mb-5">
            <div className="flex gap-3">
                <div className="avatar mask mask-squircle placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                        <span>DP</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex gap-1">
                        <p>Daniel Pátek</p>
                        <p className="font-bold opacity-50">·</p>
                        <p className="opacity-50">15. května 2023</p>
                    </div>
                    <Rating
                        readonly
                        initialValue={4}
                        emptyClassName="flex"
                        SVGclassName="inline-block"
                        //fillColor={colors.primary}
                        //emptyColor={colors["base-content"]}
                        size={25}
                    />
                </div>
            </div>
            <div className="flex mr-3">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mauris tincidunt sem sed arcu. Nulla turpis magna, cursus sit amet, suscipit
                a, interdum id, felis. Donec vitae arcu. Fusce aliquam vestibulum ipsum. Proin pede metus, vulputate nec, fermentum fringilla,
                vehicula vitae, justo. Integer lacinia.
            </div>
        </div>
    );
}

export default OneReview;
