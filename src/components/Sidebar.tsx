/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Home, 
  TrendingUp, 
  Trophy, 
  Briefcase, 
  Award, 
  BookOpen, 
  Info, 
  Settings, 
  X,
  Sparkles,
  Zap
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
}

export default function Sidebar({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  user,
}: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Homepage", icon: Home, desc: "Intro & Tutorial" },
    { id: "market", label: "Market Area", icon: TrendingUp, desc: "Live Candlestick charts" },
    { id: "arena", label: "Game Arena", icon: Trophy, desc: "High-stakes predictions" },
    { id: "portfolio", label: "My Portfolio", icon: Briefcase, desc: "Track performance" },
    { id: "settings", label: "Settings", icon: Settings, desc: "Configure terminal" },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-out Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 z-50 bg-slate-50 border-r border-slate-200 shadow-2xl transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
         } flex flex-col`}
      >
        {/* Header Block */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-500 shadow-md">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-sans text-sm font-extrabold text-slate-800 block">Stock Survivor</span>
              <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Interactive Terminal</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg h-8 w-8 flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User mini status */}
        <div className="p-4 mx-4 my-3 bg-slate-100 border border-slate-200 rounded-2xl flex items-center space-x-3 text-left">
          <div className="h-10 w-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-blue-600">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block truncate leading-tight">{user.name}</span>
            <span className="text-[9px] font-mono text-slate-400 uppercase">{user.rank}</span>
            <div className="flex items-center space-x-1 mt-1 font-mono text-[9px] text-amber-700">
              <span>🪙 {user.coins} Coins</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center space-x-3.5 rounded-xl px-3.5 py-3 text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10 border-l-4 border-blue-400"
                    : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                <div>
                  <span className="text-xs font-extrabold block leading-tight">{item.label}</span>
                  <span className={`text-[9px] block ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 text-center">
          <span className="font-mono text-[8px] text-slate-400 tracking-wider">
            STOCK SURVIVOR v2.6 TERMINAL
          </span>
        </div>
      </aside>
    </>
  );
}
