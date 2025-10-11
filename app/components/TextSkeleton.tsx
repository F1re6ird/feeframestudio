import React from 'react'

const TextSkeleton = () => {
    return (
        <div className="w-full flex flex-col gap-4 items-center sm:items-start">
      <div className="h-4 w-ful rounded-md bg-[#d85425] opacity-70 relative overflow-hidden">
        <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
      </div>
      <div className="h-4 w-[80%] rounded-md bg-[#d85425] opacity-70 relative overflow-hidden">
        <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
      </div>
      <div className="h-4 w-[50%] rounded-md bg-[#d85425] opacity-70 relative overflow-hidden">
        <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/50 to-transparent"></span>
      </div>
    </div>
    )
}

export default TextSkeleton
