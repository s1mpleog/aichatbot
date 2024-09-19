import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-[#4c1f2d] rounded w-3/4"></div>
      <div className="h-4 bg-[#4c1f2d] rounded w-1/2"></div>
      <div className="h-4 bg-[#4c1f2d] rounded w-5/6"></div>
      <div className="h-4 bg-[#4c1f2d] rounded w-2/3"></div>
    </div>
  );
}
