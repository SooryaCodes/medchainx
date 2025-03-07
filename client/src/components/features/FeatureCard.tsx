"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
};

export default function FeatureCard({ icon, title, description, isActive, onClick }: FeatureProps) {
  return (
    <div 
      className={`flex items-start p-4 rounded-lg transition-all duration-300 cursor-pointer ${
        isActive 
          ? "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500" 
          : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
      }`}
      onClick={onClick}
    >
      <div className={`flex-shrink-0 mr-3 mt-1 ${isActive ? "text-blue-600" : "text-gray-400"}`}>
        {isActive ? <CheckCircle className="h-5 w-5" /> : icon}
      </div>
      <div>
        <h4 className={`font-medium ${
          isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
        }`}>
          {title}
        </h4>
        {isActive && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 animate-fade-in-up">
            {description}
          </p>
        )}
      </div>
    </div>
  );
} 