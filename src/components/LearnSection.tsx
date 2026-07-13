/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LEARN_TOPICS, LearnTopic } from "../data/learningContent";
import { BookOpen, Search, ChevronDown, ChevronUp, Star, Award, Sparkles } from "lucide-react";

export default function LearnSection({ isNested = false }: { isNested?: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Basics" | "Analysis" | "Risk & Strategy">("All");

  const filteredTopics = LEARN_TOPICS.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={`bg-transparent text-slate-800 ${isNested ? "pt-2" : "p-4 sm:p-6 lg:p-8"} text-left`}>
      {/* Title */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-sans text-2xl font-black text-slate-900 flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-blue-600" /> Wall Street Education Academy
          </h1>
          <p className="font-sans text-xs text-slate-500 mt-1">
            Build bulletproof investing literacy with bite-sized premium lessons, illustrations, and expert rules.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search financial topics..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-4 font-sans text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10"
          />
        </div>
      </div>

      {/* Category Toggles */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["All", "Basics", "Analysis", "Risk & Strategy"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3.5 py-1.5 font-sans text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics grid */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedId === topic.id;
          return (
            <div
              key={topic.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? "border-blue-200 bg-blue-50/30"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* Card Header (Clickable toggle) */}
              <div
                onClick={() => toggleExpand(topic.id)}
                className="flex cursor-pointer items-center justify-between p-5"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl block leading-none">{topic.illustration}</span>
                  <div>
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-sans text-[9px] font-bold text-slate-500 uppercase">
                      {topic.category}
                    </span>
                    <h3 className="mt-1 font-sans text-sm font-extrabold text-slate-950 sm:text-base">
                      {topic.title}
                    </h3>
                    <p className="mt-1 font-sans text-xs text-slate-500 line-clamp-1">
                      {topic.summary}
                    </p>
                  </div>
                </div>

                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {/* Card Expanded Content */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-white p-5 font-sans text-slate-700">
                  <div className="space-y-3 text-xs leading-relaxed max-w-3xl">
                    {topic.content.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {/* Key Terminology highlights */}
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <h4 className="font-sans text-xs font-bold text-blue-600 flex items-center">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Key Terminology
                    </h4>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      {topic.keyTerms.map((kt, i) => (
                        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left">
                          <span className="font-sans text-xs font-bold text-slate-900 block">{kt.term}</span>
                          <p className="mt-1 font-sans text-[11px] leading-normal text-slate-500">{kt.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
