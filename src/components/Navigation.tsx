/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  TrendingUp, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  Award, 
  Coins, 
  Zap,
  Globe
} from "lucide-react";

interface NavigationProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onToggleSidebar: () => void;
}

export default function Navigation({
  user,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onToggleSidebar,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "market", label: "Market Area" },
    { id: "arena", label: "Game Arena" },
    { id: "portfolio", label: "My Portfolio" },
    { id: "settings", label: "Settings" },
  ];

  const notifications = [
    { id: "n1", text: "🔥 3-Day Daily Streak Bonus unlocked! (+20 Coins)", time: "Just now" },
    { id: "n2", text: "📈 NVIDIA scenario completed. Earned Smart Trader badge!", time: "2 hours ago" },
    { id: "n3", text: "📢 The Dot-Com Crash challenge is open. Predict the crash!", time: "1 day ago" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-slate-50/85 backdrop-blur-md text-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Dashboard menu and Logo & Brand group */}
          <div className="flex items-center space-x-3.5">
            {/* Clickable Menu toggle button in left corner */}
            <button
              onClick={onToggleSidebar}
              className="flex items-center space-x-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 font-sans text-xs font-bold text-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-500/5 active:scale-95"
            >
              <Menu className="h-4 w-4" />
              <span className="hidden sm:inline">Menu</span>
            </button>

            <div 
              onClick={() => setActiveTab("home")}
              className="flex cursor-pointer items-center space-x-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="hetvii">
                Stock Survivor
              </span>
            </div>
          </div>

          {/* Search bar (Desktop) */}
          <div className="hidden max-w-xs flex-1 px-4 md:block">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks, indices, lessons..."
                className="w-full rounded-xl border border-slate-200 bg-slate-100/80 py-2 pl-9 pr-4 font-sans text-xs text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500/50 focus:bg-white focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden lg:flex lg:space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`rounded-lg px-3 py-2 font-sans text-xs font-semibold tracking-wide transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Status Indicators & Profile */}
          <div className="flex items-center space-x-3">
            {/* Coins */}
            <div className="flex items-center space-x-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-sm">
              <Coins className="h-3.5 w-3.5 animate-pulse text-amber-500" />
              <span>{user.coins}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              <span>{user.streak}d</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl backdrop-blur-xl ring-1 ring-black/5">
                  <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-sans text-xs font-bold text-slate-800">Alert Center</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="font-sans text-[10px] text-blue-600 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="text-left">
                        <p className="font-sans text-[11px] leading-relaxed text-slate-700">{notif.text}</p>
                        <span className="font-mono text-[9px] text-slate-400">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Summary */}
            <div 
              onClick={() => setActiveTab("portfolio")}
              className="flex cursor-pointer items-center space-x-2 rounded-xl border border-slate-200 bg-slate-100 p-1 pr-2.5 hover:bg-slate-200"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-left md:block">
                <p className="font-sans text-[10px] font-bold text-slate-800 leading-none">{user.name}</p>
                <span className="font-mono text-[8px] text-blue-600 uppercase tracking-widest">{user.rank}</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 lg:hidden"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white/95 p-4 backdrop-blur-xl lg:hidden">
          {/* Mobile search */}
          <div className="mb-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks, lessons, rules..."
                className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2 pl-9 pr-4 font-sans text-xs text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`rounded-xl py-2.5 font-sans text-xs font-semibold tracking-wide transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
