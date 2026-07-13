/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import LeaderboardView from "./LeaderboardView";
import PortfolioView from "./PortfolioView";
import { UserProfile } from "../types";

interface CombinedViewProps {
  user: UserProfile;
}

export default function CombinedView({ user }: CombinedViewProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* Left side: Leaderboard */}
      <div className="xl:col-span-5 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <LeaderboardView user={user} />
      </div>
 
      {/* Right side: Portfolio */}
      <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <PortfolioView user={user} />
      </div>
    </div>
  );
}
