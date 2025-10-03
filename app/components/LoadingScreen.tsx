'use client'
import React from "react";
import WeirdNav from "./WeirdNav";

const LoadingScreen = () => {
    return (
        <div>
            <WeirdNav />
            <div className="relative flex items-center justify-center min-h-screen bg-[#f3fcf2]">
                <div className="w-16 h-16 border-4 border-[#d85425] border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>

    );
};

export default LoadingScreen;
