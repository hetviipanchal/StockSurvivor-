/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  GraduationCap, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  Globe, 
  Cpu, 
  BarChart2, 
  FileText 
} from "lucide-react";

export default function AboutSection({ isNested = false }: { isNested?: boolean }) {
  return (
    <div className={`bg-transparent text-slate-800 ${isNested ? "pt-2" : "p-4 sm:p-6 lg:p-8"} text-left`}>
      {/* Title */}
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="font-sans text-2xl font-black text-slate-900">
          About Stock Survivor
        </h1>
        <p className="font-sans text-xs text-slate-500 mt-1">
          Learn the mission, goals, supported Sustainable Development Goals (SDGs), and underlying technology.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 cols: Detailed Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Mission & Problem Statement */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-sans text-base font-bold text-slate-900 flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-blue-600" /> Project Mission
            </h2>
            <p className="mt-3 font-sans text-xs leading-relaxed text-slate-600">
              The ultimate objective of <strong>Stock Survivor</strong> is to provide a zero-risk, high-fidelity sandbox where college students and young adults can bridge the gap between abstract textbook theories and actual market dynamics.
            </p>
            <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600">
              Traditional financial models can feel daunting and risk real money, causing many potential savers to avoid investing entirely. By introducing gamified daily prediction missions and historical scenario replays, Stock Survivor turns deep technical analysis and financial metrics into an interactive, risk-free outrun game.
            </p>
          </div>

          {/* Supported SDGs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-sans text-base font-bold text-slate-900 flex items-center">
              <Globe className="mr-2 h-5 w-5 text-blue-600" /> Sustainable Development Goals (SDG)
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start space-x-3 text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans text-xs font-bold text-slate-900">SDG 4: Quality Education</h3>
                  <p className="font-sans text-[11px] leading-relaxed text-slate-600 mt-0.5">
                    Ensuring that financial literacy—a critical life skill neglected by traditional school curricula—is accessible freely and globally. Stock Survivor provides highly structured lessons, key terminologies, and real-world simulations to elevate student competencies.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans text-xs font-bold text-slate-900">SDG 8: Decent Work & Economic Growth</h3>
                  <p className="font-sans text-[11px] leading-relaxed text-slate-600 mt-0.5">
                    Promoting structural asset growth and sustainable capital allocation. Sizing positions properly, analyzing volatility, and avoiding emotional behavior helps prevent capital wipeouts, directly paving the path for personal savings and economic growth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gamification Approach */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-sans text-base font-bold text-slate-900 flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-blue-600" /> Why Gamification?
            </h2>
            <p className="mt-3 font-sans text-xs leading-relaxed text-slate-600">
              Human psychology struggles with abstract probabilities and risk calculations. When learning is gamified with <strong>XP, Coins, Badges, and Leaderboards</strong>, the brain forms healthy feedback loops that reinforce successful strategies while cushioning mistake pains. Replaying a real historical crash makes lessons memorable far beyond traditional static book reading.
            </p>
          </div>
        </div>

        {/* Right 1 col: Tech Stack & Credits */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
              <Cpu className="mr-1.5 h-4 w-4 text-blue-600" /> Technology Stack
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-sans text-xs text-slate-500">UI Architecture</span>
                <span className="font-mono text-xs font-bold text-slate-800">React 19 & TypeScript</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-sans text-xs text-slate-500">Styling Core</span>
                <span className="font-mono text-xs font-bold text-slate-800">Tailwind CSS 4.0</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-sans text-xs text-slate-500">AI Engine</span>
                <span className="font-mono text-xs font-bold text-slate-800">Google Gemini 3.5</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-sans text-xs text-slate-500">Visual Charts</span>
                <span className="font-mono text-xs font-bold text-slate-800">Recharts / Custom SVG</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-sans text-xs text-slate-500">Data Sourcing</span>
                <span className="font-mono text-xs font-bold text-slate-800">MarketStack API / Fetch</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="font-sans text-xs text-slate-500">Backend Server</span>
                <span className="font-mono text-xs font-bold text-slate-800">Express NodeJS (ESM)</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-left">
            <h4 className="font-sans text-xs font-bold text-blue-900 uppercase tracking-wider block">Hackathon Ready</h4>
            <p className="mt-2 font-sans text-[11px] leading-relaxed text-slate-600">
              This application has been meticulously modularized, stylized, and optimized to resemble commercial SaaS investment software. Ideal for showcase to recruiters, judges, and venture seeds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
