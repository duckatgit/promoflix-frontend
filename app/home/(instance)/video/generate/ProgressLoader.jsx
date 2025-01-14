"use client";
import React from "react";

const ProgressLoader = ({ percentage }) => {
 
  const radius = 48; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex justify-center items-center h-[167px] bg-[#d8bc511a] rounded-[10px]">
      {/* Circular Loader */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 128 128">
          {/* Background Circle */}
          <circle
            stroke="#e5e7eb" // Light gray stroke
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
          />
          {/* Progress Circle */}
          <circle
            stroke="#FFC000" // Progress color
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="64"
            cy="64"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
        </svg>

        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressLoader;
