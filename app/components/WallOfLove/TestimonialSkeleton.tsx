import React from "react";

const TestimonialSkeleton = () => {
  return (
    <div className="w-full max-w-md p-6 rounded-2xl border shadow-sm bg-white animate-pulse">
      {/* Avatar */}
      <div className="flex flex-col mb-4">
        <div className=" flex-1">
          <div className="h-4 bg-brand rounded w-24 mb-2"></div>
          <div className="h-3 bg-brand rounded w-16"></div>
        </div>
      </div>
      {/* Content lines */}
      <div className="space-y-3">
        <div className="h-3 bg-brand rounded w-full"></div>
        <div className="h-3 bg-brand rounded w-11/12"></div>
        <div className="h-3 bg-brand rounded w-9/12"></div>
      </div>
    </div>
  );
};

export default TestimonialSkeleton;