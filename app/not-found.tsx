// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3fcf2] text-center px-6">
      <h1 className="text-[120px] font-bold text-[#d85425]">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
      <p className="mt-4 text-gray-600 max-w-md">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-[#d85425] text-white rounded-xl shadow-lg hover:opacity-90 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
