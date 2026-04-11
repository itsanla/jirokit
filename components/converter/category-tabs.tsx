"use client";

import React from "react";

interface CategoryTabsProps {
  tabs: { key: string; label: string; icon: React.ReactNode }[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function CategoryTabs({
  tabs,
  activeTab,
  onTabChange,
}: CategoryTabsProps) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex h-12 items-center rounded-lg bg-blue-gray-50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all md:px-6 ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
