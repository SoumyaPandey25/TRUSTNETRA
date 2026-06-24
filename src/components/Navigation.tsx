/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Shield, Eye, Settings, RefreshCw, KeyRound, Radio, Activity } from "lucide-react";
import { UserRole } from "../types";

interface NavigationProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  trustScore: number;
}

export default function Navigation({
  currentRole,
  onRoleChange,
  activeTab,
  setActiveTab,
  trustScore,
}: NavigationProps) {
  // Translate score to requested Decision Badges: Green/Yellow/Orange/Red
  const getDecisionBadge = (score: number) => {
    if (score >= 85) {
      return {
        label: "APPROVE",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        indicator: "bg-emerald-500",
        glow: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
      };
    } else if (score >= 60) {
      return {
        label: "STEP-UP VERIFICATION",
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/30",
        indicator: "bg-amber-500",
        glow: "shadow-[0_0_12px_rgba(245,158,11,0.15)]",
      };
    } else if (score >= 20) {
      return {
        label: "REVIEW",
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/30",
        indicator: "bg-orange-400 animate-pulse",
        glow: "shadow-[0_0_12px_rgba(249,115,22,0.15)]",
      };
    } else {
      return {
        label: "BLOCK",
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/35",
        indicator: "bg-red-500 animate-ping",
        glow: "shadow-[0_0_12px_rgba(239,68,68,0.2)]",
      };
    }
  };

  const badge = getDecisionBadge(trustScore);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("landing")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Shield className="h-5 w-5 text-amber-500 animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-lg font-bold tracking-wider text-white">
              TRUST<span className="text-amber-500">NETRA</span>
            </span>
            <p className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">
              Identity Trust Fabric
            </p>
          </div>
        </div>

        {/* Central Responsive Menu */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            id="nav-scen-simulator"
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs font-semibold rounded-md border transition-all ${
              activeTab === "simulator"
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.06)] scale-[1.01]"
                : "text-slate-400 border-transparent hover:text-slate-100 hover:bg-slate-900"
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            Live Demo Simulator
          </button>

          {currentRole === "CUSTOMER" && (
            <>
              <button
                id="nav-cust-summary"
                onClick={() => setActiveTab("customer-dash")}
                className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs font-medium rounded-md transition-all ${
                  activeTab === "customer-dash"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                My Security Hub
              </button>
              <button
                id="nav-cust-twin"
                onClick={() => setActiveTab("digital-twin")}
                className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs font-medium rounded-md transition-all ${
                  activeTab === "digital-twin"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`}
              >
                <KeyRound className="h-3.5 w-3.5" />
                Digital Twin Profile
              </button>
            </>
          )}

          {currentRole === "SECURITY_OFFICER" && (
            <>
              <button
                id="nav-ofc-monitor"
                onClick={() => setActiveTab("officer-dash")}
                className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs font-medium rounded-md transition-all ${
                  activeTab === "officer-dash"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Radio className="h-3.5 w-3.5 text-red-500 animate-ping" />
                Live Incident Monitor
              </button>
              <button
                id="nav-ofc-adaptive"
                onClick={() => setActiveTab("adaptive-engine")}
                className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs font-medium rounded-md transition-all ${
                  activeTab === "adaptive-engine"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                Adaptive Engine
              </button>
              <button
                id="nav-ofc-tix"
                onClick={() => setActiveTab("tix-exchange")}
                className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs font-medium rounded-md transition-all ${
                  activeTab === "tix-exchange"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Trust Exchange (TIX)
              </button>
            </>
          )}

          {currentRole === "ADMIN" && (
            <>
              <button
                id="nav-admin-dashboard"
                onClick={() => setActiveTab("admin-dash")}
                className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs font-medium rounded-md transition-all ${
                  activeTab === "admin-dash"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Global Policies & AI Models
              </button>
              <button
                id="nav-admin-tix"
                onClick={() => setActiveTab("tix-exchange")}
                className={`flex items-center gap-2 px-3.5 py-2 font-mono text-xs font-medium rounded-md transition-all ${
                  activeTab === "tix-exchange"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Core Threat Feed
              </button>
            </>
          )}
        </nav>

        {/* Right Side: Role Selector & Security Indicator */}
        <div className="flex items-center gap-4">
          
          {/* Global Decision Badge representing Live Platform Posture */}
          <div className={`hidden sm:flex items-center gap-2 rounded-lg ${badge.bg} ${badge.border} ${badge.glow} px-3 py-1.5 font-mono text-xs border transition-all duration-300`}>
            <span className="text-[10px] uppercase font-medium text-slate-400 font-sans">Decision:</span>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${badge.indicator}`}></span>
              <span className={`font-black tracking-wider ${badge.text}`}>
                {badge.label}
              </span>
            </div>
            <span className="text-slate-500 mx-1">|</span>
            <span className="text-slate-200 font-bold">{trustScore}% Trust</span>
          </div>

          {/* Role Switching Panel */}
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-900/90 p-1 border border-slate-800">
            <span className="hidden lg:inline px-2 font-mono text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
              Actor Mode:
            </span>
            {(["CUSTOMER", "SECURITY_OFFICER", "ADMIN"] as UserRole[]).map((r) => (
              <button
                key={r}
                id={`switch-to-${r.toLowerCase()}`}
                onClick={() => onRoleChange(r)}
                className={`rounded-md px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider transition-all uppercase ${
                  currentRole === r
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                }`}
              >
                {r === "SECURITY_OFFICER" ? "Officer" : r.toLowerCase()}
              </button>
            ))}
          </div>

        </div>

      </div>
    </header>
  );
}
