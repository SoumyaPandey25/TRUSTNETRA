/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Zap, Brain, 
  Fingerprint, MapPin, Activity, Terminal, ArrowRight, Lock, 
  Unlock, Laptop, CheckCircle2, RefreshCw, Cpu, Gauge 
} from "lucide-react";

interface ScenarioSimulatorProps {
  trustData: {
    userId: string;
    trustScore: number;
    status: string;
    breakdown: {
      behaviorScore: number;
      deviceScore: number;
      transactionScore: number;
      contextScore: number;
    };
  };
  devices: any[];
  activities: any[];
  anomalyProfile: {
    explanation: string;
  } | null;
  threatIntelligence: any[];
  onTriggerScenario: (id: string, label: string) => Promise<void>;
}

export default function ScenarioSimulator({
  trustData,
  devices,
  activities,
  anomalyProfile,
  threatIntelligence,
  onTriggerScenario,
}: ScenarioSimulatorProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("SCEN_01");
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // When the component loads, let's default to the current state based on trustScore
  useEffect(() => {
    if (trustData.trustScore >= 90) {
      setActiveScenarioId("SCEN_01");
    } else if (trustData.trustScore >= 60 && trustData.trustScore < 90) {
      setActiveScenarioId("SCEN_02");
    } else if (trustData.trustScore > 10 && trustData.trustScore < 60) {
      setActiveScenarioId("SCEN_03");
    } else {
      setActiveScenarioId("SCEN_04");
    }
    setAiReport(null);
  }, [trustData.trustScore]);

  const handleScenarioClick = async (scenarioId: string, label: string) => {
    setLoadingScenario(scenarioId);
    setAiReport(null);
    try {
      await onTriggerScenario(scenarioId, label);
      setActiveScenarioId(scenarioId);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingScenario(null);
    }
  };

  const handleGenerateRiskReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await fetch("/api/explain-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: trustData.trustScore,
          status: trustData.status,
          behaviorScore: trustData.breakdown.behaviorScore,
          deviceScore: trustData.breakdown.deviceScore,
          transactionScore: trustData.breakdown.transactionScore,
          contextScore: trustData.breakdown.contextScore,
          explanationText: anomalyProfile?.explanation || "Continuous behavioral integrity scanning."
        })
      });
      const data = await response.json();
      setAiReport(data.response);
    } catch (e) {
      console.error(e);
      setAiReport("Network error generating the cryptographic risk digest. Node offline.");
    } finally {
      setGeneratingReport(false);
    }
  };

  // Compute decision text and badge colors based on the current scenario/trust state
  const getDecisionDetails = () => {
    const score = trustData.trustScore;
    
    if (activeScenarioId === "SCEN_01" && score >= 85) {
      return {
        title: "SESSION APPROVED",
        description: "Standard access granted. Keystroke rhythms, regional subnets, and hardware configurations are in complete alignment with Hari Narayanan's historical baseline profile.",
        icon: <Unlock className="h-6 w-6 text-emerald-400" />,
        borderColor: "border-emerald-500/30",
        bgColor: "bg-emerald-950/10",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        authority: "Adaptive Heuristic Profile Engine",
        actionRequired: "Continuous frictionless background observation.",
        decisionBadgeText: "APPROVE",
        decisionBadgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
        decisionDotColor: "bg-emerald-500"
      };
    } else if (activeScenarioId === "SCEN_02" || (score >= 60 && score < 85)) {
      return {
        title: "STEP-UP MFA CHALLENGE TRIGGERED",
        description: "Access from Windows 11 PC registered with impossible geographic speed (Mumbai to New Delhi) inside 1 hour. Session challenged with a hardware-bound RSA credential request.",
        icon: <Zap className="h-6 w-6 text-amber-500" />,
        borderColor: "border-amber-500/30",
        bgColor: "bg-amber-950/10",
        badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
        authority: "Multi-Variable Anomaly Heuristics Node",
        actionRequired: "Awaiting physical secure token MFA authentication response.",
        decisionBadgeText: "STEP-UP VERIFICATION",
        decisionBadgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/35 shadow-[0_0_15px_rgba(234,179,8,0.15)]",
        decisionDotColor: "bg-yellow-500"
      };
    } else if (activeScenarioId === "SCEN_03" || (score >= 20 && score < 60)) {
      return {
        title: "RECOVERY SUSPENDED & BLOCKED",
        description: "Critical alert! Sudden high-risk credential recovery form submitted from Lagos, Nigeria. Fingerprint indicates an Android Emulator tunneling via specialized Tor gateway. Access suspended.",
        icon: <ShieldAlert className="h-6 w-6 text-orange-500" />,
        borderColor: "border-orange-500/30",
        bgColor: "bg-orange-950/10",
        badgeColor: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        authority: "Unsupervised Isolation Controller",
        actionRequired: "Forced device lockdown. Sent to senior security officer triage queue.",
        decisionBadgeText: "REVIEW",
        decisionBadgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/35 shadow-[0_0_15px_rgba(249,115,22,0.15)]",
        decisionDotColor: "bg-orange-500"
      };
    } else {
      return {
        title: "PROACTIVE THREAT TERMINATION",
        description: "Connection terminated immediately at edge router. The connecting IP node was identified on PNB's Trust Exchange (TIX) network as participating in structured OTP bypass attacks.",
        icon: <Lock className="h-6 w-6 text-rose-500 animate-pulse" />,
        borderColor: "border-rose-900/40",
        bgColor: "bg-rose-950/15",
        badgeColor: "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse",
        authority: "Interbank TIX Ledger Network Sync",
        actionRequired: "Automatic security boundary block. No user interaction permitted.",
        decisionBadgeText: "BLOCK",
        decisionBadgeColor: "bg-red-500/15 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse",
        decisionDotColor: "bg-red-500"
      };
    }
  };

  const decision = getDecisionDetails();

  return (
    <div className="bg-slate-950 min-h-screen py-10 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="border-b border-slate-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 mb-2 font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              <Activity className="h-3 w-3 text-amber-500 animate-pulse" />
              Project Live Demo Workspace
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl">
              Interactive Scenario Simulator
            </h1>
            <p className="mt-1 text-sm text-slate-400 font-light">
              Execute targeted cybersecurity threat vectors to observe real-time Trust Score adjustments, risk indicator variations, and autonomous engine decisions on a single screen.
            </p>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500 bg-slate-900/60 rounded-lg p-3 border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Live Sync: Active Ledger Node Connected</span>
          </div>
        </div>

        {/* Dynamic Dual Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: 4 Scenario Actions (5 Cols on large screens) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <Cpu className="h-4 w-4 text-amber-500" />
                <h3 className="font-mono text-xs font-extrabold text-slate-300 tracking-wider uppercase">
                  SIMULATION CONTROLLERS
                </h3>
              </div>
              
              <div className="space-y-3.5">
                
                {/* Scenario 1 */}
                <button
                  id="simulator-scen-1"
                  onClick={() => handleScenarioClick("SCEN_01", "Legitimate Customer Access")}
                  disabled={loadingScenario !== null}
                  className={`w-full text-left p-4 rounded-xl border transition-all relative flex flex-col ${
                    activeScenarioId === "SCEN_01"
                      ? "bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                      activeScenarioId === "SCEN_01" ? "text-emerald-400" : "text-slate-400"
                    }`}>
                      Scenario 1
                    </span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/10">
                      Legitimate Login
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2 group-hover:text-amber-400 transition-colors">
                    Legitimate Login Access
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 font-light leading-relaxed">
                    Verifies keystroke cadences, regular office-hours access, and matches registered secure hardware configurations inside Mumbai region.
                  </p>
                  
                  {loadingScenario === "SCEN_01" && (
                    <span className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center font-mono text-xs text-emerald-400">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Injecting signals...
                    </span>
                  )}
                </button>

                {/* Scenario 2 */}
                <button
                  id="simulator-scen-2"
                  onClick={() => handleScenarioClick("SCEN_02", "New Device Login")}
                  disabled={loadingScenario !== null}
                  className={`w-full text-left p-4 rounded-xl border transition-all relative flex flex-col ${
                    activeScenarioId === "SCEN_02"
                      ? "bg-amber-950/15 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                      activeScenarioId === "SCEN_02" ? "text-amber-400" : "text-slate-400"
                    }`}>
                      Scenario 2
                    </span>
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/10">
                      Unregistered Hardware
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2">
                    New Device Login Profile
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 font-light leading-relaxed">
                    Flag an unrecognized Windows machine entering from New Delhi. Large geographic distance triggers security threshold step-up challenge.
                  </p>

                  {loadingScenario === "SCEN_02" && (
                    <span className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center font-mono text-xs text-amber-400">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Rerouting traffic...
                    </span>
                  )}
                </button>

                {/* Scenario 3 */}
                <button
                  id="simulator-scen-3"
                  onClick={() => handleScenarioClick("SCEN_03", "Suspicious Account Recovery")}
                  disabled={loadingScenario !== null}
                  className={`w-full text-left p-4 rounded-xl border transition-all relative flex flex-col ${
                    activeScenarioId === "SCEN_03"
                      ? "bg-red-950/15 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                      activeScenarioId === "SCEN_03" ? "text-red-400" : "text-slate-400"
                    }`}>
                      Scenario 3
                    </span>
                    <span className="text-[9px] bg-red-500/10 text-red-400 font-mono font-bold px-2 py-0.5 rounded border border-red-500/10">
                      Account Recovery Abuse
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2">
                    Suspicious Recovery Attempt
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 font-light leading-relaxed">
                    A sudden password reset requested from Lagos, Nigeria. Spoofed emulation fingerprint and proxy network indicators match hijack signatures.
                  </p>

                  {loadingScenario === "SCEN_03" && (
                    <span className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center font-mono text-xs text-red-400">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Blocking recovery...
                    </span>
                  )}
                </button>

                {/* Scenario 4 */}
                <button
                  id="simulator-scen-4"
                  onClick={() => handleScenarioClick("SCEN_04", "Inter-Bank Threat Intelligence Sharing")}
                  disabled={loadingScenario !== null}
                  className={`w-full text-left p-4 rounded-xl border transition-all relative flex flex-col ${
                    activeScenarioId === "SCEN_04"
                      ? "bg-rose-950/15 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                      activeScenarioId === "SCEN_04" ? "text-rose-400" : "text-slate-400"
                    }`}>
                      Scenario 4
                    </span>
                    <span className="text-[9px] bg-rose-500/10 text-rose-400 font-mono font-bold px-2 py-0.5 rounded border border-rose-500/10">
                      Fraud Signal Received
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2">
                    Threat Intelligence Shared
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 font-light leading-relaxed">
                    Punjab National Bank (PNB) broadcasts a compromised regional IP pattern onto the TIX collaborative network. Active intercept terminates connection.
                  </p>

                  {loadingScenario === "SCEN_04" && (
                    <span className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center font-mono text-xs text-rose-400">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Syncing TIX blocklist...
                    </span>
                  )}
                </button>

              </div>
            </div>

            {/* Continuous Trust Score Timeline */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <Activity className="h-4 w-4 text-amber-500" />
                <h3 className="font-mono text-xs font-extrabold text-slate-300 tracking-wider uppercase">
                  CONTINUOUS TRUST VALIDATION TIMELINE
                </h3>
              </div>
              
              <div className="relative pl-6 space-y-5 before:absolute before:bottom-3 before:top-2 before:left-2.5 before:w-0.5 before:bg-slate-800/80">
                {/* Step 1 */}
                <div className={`relative transition-all duration-300 rounded-lg p-2 border ${
                  activeScenarioId === "SCEN_01" 
                    ? "bg-slate-900/60 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.06)]" 
                    : "border-transparent opacity-50 hover:opacity-75"
                }`}>
                  {/* Timeline Node Symbol */}
                  <div className={`absolute -left-[23px] top-4.5 h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                    activeScenarioId === "SCEN_01" 
                      ? "bg-emerald-500 border-slate-950 ring-4 ring-emerald-500/20" 
                      : "bg-slate-800 border-slate-950"
                  }`} />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider block">STEP 1 &bull; ESTABLISH BASELINE</span>
                      <h5 className="text-xs font-extrabold text-white">Legitimate Customer Access</h5>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-black border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        92% APPROVE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`relative transition-all duration-300 rounded-lg p-2 border ${
                  activeScenarioId === "SCEN_02" 
                    ? "bg-slate-900/60 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.06)]" 
                    : "border-transparent opacity-50 hover:opacity-75"
                }`}>
                  {/* Timeline Node Symbol */}
                  <div className={`absolute -left-[23px] top-4.5 h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                    activeScenarioId === "SCEN_02" 
                      ? "bg-amber-500 border-slate-950 ring-4 ring-amber-500/20" 
                      : "bg-slate-800 border-slate-950"
                  }`} />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider block">STEP 2 &bull; NEW METRIC</span>
                      <h5 className="text-xs font-extrabold text-white">New Device Detected</h5>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-black border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        65% STEP-UP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`relative transition-all duration-300 rounded-lg p-2 border ${
                  activeScenarioId === "SCEN_03" 
                    ? "bg-slate-900/60 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.06)]" 
                    : "border-transparent opacity-50 hover:opacity-75"
                }`}>
                  {/* Timeline Node Symbol */}
                  <div className={`absolute -left-[23px] top-4.5 h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                    activeScenarioId === "SCEN_03" 
                      ? "bg-orange-500 border-slate-950 ring-4 ring-orange-500/20" 
                      : "bg-slate-800 border-slate-950"
                  }`} />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider block">STEP 3 &bull; HIGH RISK ASSAY</span>
                      <h5 className="text-xs font-extrabold text-white">Suspicious Account Recovery</h5>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-black border border-orange-500/30 bg-orange-500/10 text-orange-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        25% REVIEW
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className={`relative transition-all duration-300 rounded-lg p-2 border ${
                  activeScenarioId === "SCEN_04" 
                    ? "bg-slate-900/60 border-red-500/25 shadow-[0_0_12px_rgba(239,68,68,0.08)]" 
                    : "border-transparent opacity-50 hover:opacity-75"
                }`}>
                  {/* Timeline Node Symbol */}
                  <div className={`absolute -left-[23px] top-4.5 h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                    activeScenarioId === "SCEN_04" 
                      ? "bg-red-500 border-slate-950 ring-4 ring-red-500/20" 
                      : "bg-slate-800 border-slate-950"
                  }`} />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider block">STEP 4 &bull; INTEL COUPLING</span>
                      <h5 className="text-xs font-extrabold text-white">Shared Fraud Signal Match</h5>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-black border border-red-500/30 bg-red-500/10 text-red-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        10% BLOCK
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Helper Box */}
            <div className="bg-slate-900/20 border border-slate-800/60 rounded-xl p-4.5 font-mono text-[11px] text-slate-400">
              <span className="text-amber-500 font-bold uppercase tracking-wide">💡 EVALUATOR QUICK TIP</span>
              <p className="mt-1.5 leading-relaxed font-light">
                Once a scenario is selected, you can also switch to the <strong>Live Incident Monitor</strong> or <strong>Global Policies & AI Models</strong> tabs in the top navigation bar to explore how the changes look within specific operational views.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: Live Security fabric State (7 Cols on large screens) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust score & Decisional banner combined widget */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 -z-10 rounded-full bg-slate-900 blur-2xl" />
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-800">
                {/* Score Dial */}
                <div className="flex items-center gap-5">
                  <div className="relative flex items-center justify-center h-24 w-24 rounded-full border border-slate-800 bg-slate-950 shrink-0">
                    {/* Concentric rings style */}
                    <div className="absolute inset-1.5 rounded-full border border-dashed border-slate-800" />
                    <div className="absolute inset-3.5 rounded-full border border-slate-800" />
                    
                    {/* Real-time score display */}
                    <div className="text-center z-10">
                      <span className={`text-2xl font-black font-mono block ${
                        trustData.trustScore >= 85 
                          ? "text-emerald-400" 
                          : trustData.trustScore >= 50 
                            ? "text-amber-400" 
                            : "text-red-400"
                      }`}>
                        {trustData.trustScore}%
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">
                        TRUST INDEX
                      </span>
                    </div>

                    {/* SVG Radial bar indicator */}
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        className="stroke-slate-900 fill-none"
                        strokeWidth="4"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="42"
                        className={`fill-none transition-all duration-1000 ${
                          trustData.trustScore >= 85 
                            ? "stroke-emerald-500/80" 
                            : trustData.trustScore >= 50 
                              ? "stroke-amber-500/80" 
                              : "stroke-red-500/80"
                        }`}
                        strokeWidth="4.5"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - trustData.trustScore / 100)}
                      />
                    </svg>
                  </div>
                  
                  <div>
                    <span className="font-mono text-[9px] text-slate-400 tracking-wider block uppercase">
                      ACTIVE IDENTITY RE-EVALUATION
                    </span>
                    <h3 className="text-xl font-extrabold text-white">
                      Hari Narayanan <span className="text-xs text-slate-500 font-mono font-normal">({trustData.userId})</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase border ${decision.decisionBadgeColor}`}>
                        <span className={`h-1 w-1 rounded-full ${decision.decisionDotColor}`} />
                        {decision.decisionBadgeText}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 border border-slate-800 text-slate-300">
                        MUTABLE BASELINE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Authority Tag */}
                <div className="text-right sm:text-right text-center self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                  <span className="font-mono text-[9px] text-slate-500 block">AUTHORITY MODULE:</span>
                  <span className="font-mono text-[10px] font-extrabold text-amber-500 mt-0.5 max-w-[200px] text-right">
                    {decision.authority}
                  </span>
                </div>
              </div>

              {/* Dynamic Authorization Decision Banner */}
              <div className={`mt-6 p-5 rounded-lg border ${decision.borderColor} ${decision.bgColor}`}>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 shrink-0">
                    {decision.icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-extrabold text-slate-400 tracking-wider block uppercase">
                        CURRENT BANKING AUTH DECISION
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase border ${decision.decisionBadgeColor}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${decision.decisionDotColor}`} />
                        {decision.decisionBadgeText}
                      </span>
                    </div>
                    <h4 className="text-md font-black text-white mt-2 font-sans flex items-center gap-2">
                      {decision.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
                      {decision.description}
                    </p>
                    
                    <div className="mt-3.5 pt-3.5 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-500 uppercase font-semibold">Immediate Action:</span>
                        <p className="text-slate-300 mt-0.5 font-bold">{decision.actionRequired}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 uppercase font-semibold">API Auth Proxy Gateway:</span>
                        <p className={`mt-0.5 font-bold ${activeScenarioId === 'SCEN_01' ? 'text-emerald-400' : activeScenarioId === 'SCEN_02' ? 'text-amber-400' : 'text-red-400'}`}>
                          {activeScenarioId === 'SCEN_01' ? '200 OK / SESSION_GRANTED' : activeScenarioId === 'SCEN_02' ? '401 UNAUTHORIZED / MFA_CHALLENGE' : '403 FORBIDDEN / IP_ISOLATED'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Risk Indicators section */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-5">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-amber-500" />
                  <h3 className="font-mono text-xs font-extrabold text-slate-300 tracking-wider uppercase">
                    CONTINUOUS VARIABLE RISK COEFFICIENTS
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-slate-500">Weight: Adaptive Formula</span>
              </div>

              {/* Grid representation of the 4 risk indices as requested */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Indicator 1: Keyboard Dynamics & Behavior */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Brain className="h-3.5 w-3.5 text-pink-500" />
                      Behavior Dynamics Risk
                    </span>
                    <span className={`font-mono text-xs font-bold ${
                      trustData.breakdown.behaviorScore > 75 
                        ? "text-red-400" 
                        : trustData.breakdown.behaviorScore > 30 
                          ? "text-amber-400" 
                          : "text-emerald-400"
                    }`}>
                      {trustData.breakdown.behaviorScore}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        trustData.breakdown.behaviorScore > 75 
                          ? "bg-red-500" 
                          : trustData.breakdown.behaviorScore > 30 
                            ? "bg-amber-500" 
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${trustData.breakdown.behaviorScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-light">
                    Keystroke dynamics, dwell time, navigation speed vs. historic baseline profile.
                  </p>
                </div>

                {/* Indicator 2: Device Fingerprint & Integrity */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Fingerprint className="h-3.5 w-3.5 text-cyan-500" />
                      Device Intelligence Risk
                    </span>
                    <span className={`font-mono text-xs font-bold ${
                      trustData.breakdown.deviceScore > 75 
                        ? "text-red-400" 
                        : trustData.breakdown.deviceScore > 30 
                          ? "text-amber-400" 
                          : "text-emerald-400"
                    }`}>
                      {trustData.breakdown.deviceScore}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        trustData.breakdown.deviceScore > 75 
                          ? "bg-red-500" 
                          : trustData.breakdown.deviceScore > 30 
                            ? "bg-amber-500" 
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${trustData.breakdown.deviceScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-light">
                    Crypto secure-hardware enclave identification, system headers, OS version matching.
                  </p>
                </div>

                {/* Indicator 3: Transaction Delta */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      Transaction Delta Deviation
                    </span>
                    <span className={`font-mono text-xs font-bold ${
                      trustData.breakdown.transactionScore > 75 
                        ? "text-red-400" 
                        : trustData.breakdown.transactionScore > 30 
                          ? "text-amber-400" 
                          : "text-emerald-400"
                    }`}>
                      {trustData.breakdown.transactionScore}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        trustData.breakdown.transactionScore > 75 
                          ? "bg-red-500" 
                          : trustData.breakdown.transactionScore > 30 
                            ? "bg-amber-500" 
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${trustData.breakdown.transactionScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-light">
                    Amount variance, rapid-activity frequency, and external destination node risk factor scoring.
                  </p>
                </div>

                {/* Indicator 4: Context & Geolocation Drift */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                      Contextual Geolocation Drift
                    </span>
                    <span className={`font-mono text-xs font-bold ${
                      trustData.breakdown.contextScore > 75 
                        ? "text-red-400" 
                        : trustData.breakdown.contextScore > 30 
                          ? "text-amber-400" 
                          : "text-emerald-400"
                    }`}>
                      {trustData.breakdown.contextScore}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        trustData.breakdown.contextScore > 75 
                          ? "bg-red-500" 
                          : trustData.breakdown.contextScore > 30 
                            ? "bg-amber-500" 
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${trustData.breakdown.contextScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-light">
                    IP address routing integrity, VPN proxy detection, impossible travel rate calculation.
                  </p>
                </div>

              </div>
            </div>

            {/* Diagnostic Logs & AI Audit Summary */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-mono text-xs font-extrabold text-slate-300 tracking-wider">
                    DECISION HEURISTICS TELEMETRY LOGS
                  </h3>
                </div>
                <span className="font-mono text-[9px] text-slate-500">Node ID: S-67295-V1</span>
              </div>
              
              <div className="font-mono bg-slate-950 rounded-lg p-4 text-[11px] text-emerald-400/90 leading-relaxed max-h-40 overflow-y-auto space-y-1 scrollbar-thin">
                <p className="text-slate-500 font-sans italic">// Telemetry output feed matching {activeScenarioId} profile:</p>
                <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-cyan-400">INFO:</span> Scanning user identity signature...</p>
                <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-cyan-400">INFO:</span> Acquiring hardware token validation matrices...</p>
                {activeScenarioId === "SCEN_01" && (
                  <>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-emerald-400">OK:</span> Biometric TouchID validation validated successfully.</p>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-emerald-400">OK:</span> Source subnet (203.45.112.89) matched office white-list.</p>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-emerald-500 font-bold">DECISION_EMITTED:</span> ALLOW_SESSION (Friction-free, standard token).</p>
                  </>
                )}
                {activeScenarioId === "SCEN_02" && (
                  <>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-amber-400">WARN:</span> Windows Core client fingerprint is unrecognized.</p>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-amber-400">WARN:</span> Geographic drift delta: 1,150km inside 42 minutes. Flagged imposs_travel_ratio.</p>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-amber-500 font-bold">DECISION_EMITTED:</span> STEPUP_CHALLENGE_ISSUED (MFA sequence lock, waiting token).</p>
                  </>
                )}
                {activeScenarioId === "SCEN_03" && (
                  <>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-red-500">CRITICAL:</span> sudden recovery request from Android Emulator (Spoofed S23) on VPN.</p>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-red-500">CRITICAL:</span> Geolocation Lagos, NG is incompatible with active session (Mumbai, IN).</p>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-red-500 font-bold">DECISION_EMITTED:</span> BLOCK_ACCOUNT (Access blocked, device key blacklisted, supervisor paged).</p>
                  </>
                )}
                {activeScenarioId === "SCEN_04" && (
                  <>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-red-500">CRITICAL:</span> Connecting IP address matched signature ID PNB-TIX-9182.</p>
                    <p><span className="text-slate-600">[{new Date().toISOString()}]</span> <span className="text-rose-500 font-bold">DECISION_EMITTED:</span> EDGE_DISCONNECT (Connection terminated via proactive PNB Intelligence threat vector match).</p>
                  </>
                )}
              </div>

              {/* Explainable AI button using Gemini API */}
              <div className="mt-4 border-t border-slate-800/60 pt-4">
                <button
                  id="btn-gen-ai-simulator"
                  onClick={handleGenerateRiskReport}
                  disabled={generatingReport}
                  className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5 px-4 py-3 font-mono text-xs font-bold text-amber-400 hover:from-amber-500/15 hover:to-amber-500/10 transition-all cursor-pointer select-none"
                >
                  <Brain className="h-4 w-4 text-amber-400" />
                  {generatingReport ? "Generating Deep AI Risk Audit..." : "Generate AI Insights Audit Report"}
                </button>
                
                {aiReport && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs leading-relaxed text-slate-300 font-sans space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-500 font-bold uppercase pb-1.5 border-b border-slate-900 mb-2">
                      <Activity className="h-3 w-3 text-amber-500 animate-pulse" />
                      GEMINI-1.5 EXPLICABLE RISK BREAKDOWN
                    </div>
                    <p className="whitespace-pre-line">{aiReport}</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
