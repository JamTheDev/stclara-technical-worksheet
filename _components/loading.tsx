import React from "react";

interface LoadingForegroundProps {
  children?: React.ReactNode;
}

const LoadingForeground: React.FC<LoadingForegroundProps> = ({ children }) => {
  return (
    <div className="absolute w-full h-screen bg-black/50 z-30 grid place-items-center">
      <div className="h-full w-full flex items-center justify-center flex-col">
        {children ? (
          children
        ) : (
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin z-30"></div>
        )}
      </div>
    </div>
  );
};

export default LoadingForeground;
