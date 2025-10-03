import React from "react";

const SkeletonCard = () => {
    return (
        <div className="animate-pulse p-w-full md:max-w-[400px] flex flex-col items-center gap-4 py-4 flex-1 bg-gray-800 rounded-lg">
            <div className="sm:h-96 h-64 w-full object-cover rounded-lg bg-gray-700"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
    );
};

export default SkeletonCard;