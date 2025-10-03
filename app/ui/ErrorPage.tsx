"use client";
import Link from "next/link";
import WeirdNav from "../components/WeirdNav";

export default function ErrorPage() {
    return (
        <>
            <WeirdNav />
            <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light text-center px-6">
                <h1 className="text-[100px] font-bold">Error</h1>
                <h2 className="text-xl font-semibold">Something went wrong</h2>
                <p className="mt-4 max-w-md">
                    An unexpected error occurred.
                </p>
                <Link
                    href="/"
                    className="mt-6 px-6 py-3 bg-brand text-white rounded-xl shadow-lg hover:opacity-90 transition"
                >
                    Back to Home
                </Link>
            </div>
        </>

    );
}
