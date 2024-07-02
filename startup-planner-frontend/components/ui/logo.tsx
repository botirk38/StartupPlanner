"use client";

import { MountainIcon } from "lucide-react";
import Link from "next/link";

import React from "react";

export default function Logo() {
    return (
        <div className="flex items-center p-4">
            <MountainIcon className="w-8 h-8 text-primary mr-2" />
            <Link href="/" className="flex items-center">
                <span className="text-xl font-semibold text-primary">
                    Canva Startup Planner
                </span>
            </Link>
        </div>
    );
}
