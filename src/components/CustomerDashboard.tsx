/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, ShieldCheck, Laptop, Phone, Tablet, 
  MapPin, Clock, RefreshCcw, Sparkles, Brain, CheckCircle2, AlertTriangle, Play 
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Device, UserActivity } from "../types";

interface CustomerDashboardProps {
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
  devices: Device[];
  activities: UserActivity[];
  anomalyProfile: {
    explanation: string;
  };
  onBlockDevice: (id: string) => void;
  onRefreshData: () => void;
  onTriggerScenario: (id: string, label: string) => void;
}

export default function CustomerDashboard({
  trustData,
  devices,
  activities,
  anomalyProfile,
  onBlockDevice,
  onRefreshData,
  onTriggerScenario,
}: CustomerDashboardProps) {
  const [explainResult, setExplainResult] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Auto trigger audit whenever trustData changes to simulate active processing
  useEffect(() => {
    setExplainResult(null);
  }, [trustData]);

  // Request Explainable AI report from Express endpoint
  const handleExplainAI = async () => {
    setIsExplaining(true);
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
          explanationText: anomalyProfile.explanation
        })
      });
      const data = await response.json();
      setExplainResult(data.response);
    } catch (e) {
      console.error(e);
      setExplainResult("Failed to query the trust fabric AI. Please ensure connection to backend is active.");
    } finally {
      setIsExplaining(false);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "MOBILE":
        return <Phone className="h-4 w-4" />;
      case "TABLET":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (score: number) => {
    if (score < 20) {
      return <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">LOW RISK</span>;
    } else if (score < 60) {
      return <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">MEDIUM RISK</span>;
    } else {
      return <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono font-bold">HIGH RISK</span>;
    }
  };

  // Prepare Recharts Gauge data format
  const chartData = [
    {
      name: "Score",
      value: trustData.trustScore,
      fill: trustData.trustScore >= 85 ? "#10B981" : trustData.trustScore >= 60 ? "#F59E0B" : "#EF4444",
    },
  ];

  return (
    <div id="customer-dashboard-view" className="bg-slate-950 min-h-screen py-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4">
          <div>
            <span className="font-mono text-xs text-amber-500 uppercase tracking-widest font-semibold">
              Personal Trust Intelligence Gateway
            </span>
            <h2 className="text-2xl font-extrabold text-white">
              My Identity Security Hub
            </h2>
            <p className="text-sm text-slate-400 font-light mt-1">
              Analyze continuous background risk scores, manage trusted browser authentications, and view secure logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-customer-refresh"
              onClick={onRefreshData}
              className="flex items-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-850 px-3.5 py-2 font-mono text-xs font-semibold border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Sync Sensors
            </button>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          
          {/* Trust Score Radial bar widget */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col justify-between h-[360px] relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-sans font-bold text-white text-base">Your Adaptive Score</h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">Continuous evaluation</p>
              </div>
              {trustData.trustScore >= 85 ? (
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              ) : (
                <ShieldAlert className="h-6 w-6 text-amber-500 animate-bounce" />
              )}
            </div>

            {/* Radial Recharts Container */}
            <div className="relative h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width={180} height={180}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="100%"
                  barSize={12}
                  data={chartData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar dataKey="value" cornerRadius={6} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute text-center mt-2">
                <span className="text-5xl font-extrabold text-white font-sans tracking-tight">
                  {trustData.trustScore}
                </span>
                <span className="text-slate-500 font-mono text-xs block">/ 100</span>
              </div>
            </div>

            <div className="border-t border-slate-800/50 pt-4 flex justify-between items-center">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-slate-400 block uppercase">
                  CLASSIFICATION
                </span>
                <span className={`font-semibold font-mono text-xs ${
                  trustData.trustScore >= 85 ? "text-emerald-400" : trustData.trustScore >= 60 ? "text-amber-400" : "text-red-400"
                }`}>
                  {trustData.status === "TRUSTED" ? "🟢 TRUSTED ACCESS" : "🟡 STEP-UP MFA ENFORCED"}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Node: Local SBI SBI-v1</span>
            </div>
          </div>

          {/* Risk components breakdown */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col justify-between h-[360px]">
            <div>
              <h3 className="font-sans font-bold text-white text-base">Continuous Risk Signals</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Scored by ML classifiers</p>
            </div>

            <div className="space-y-4 my-2">
              {[
                { label: "Keystroke & Behavior dynamics", val: trustData.breakdown.behaviorScore, color: "bg-emerald-500" },
                { label: "Device Integrity Signature", val: trustData.breakdown.deviceScore, color: "bg-amber-400" },
                { label: "Transaction Volume Deviation", val: trustData.breakdown.transactionScore, color: "bg-indigo-400" },
                { label: "Context & Geolocation Limits", val: trustData.breakdown.contextScore, color: "bg-pink-400" }
              ].map((sig) => (
                <div key={sig.label} className="space-y-1">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-slate-400 font-light">{sig.label}</span>
                    <span className="text-slate-200 font-bold">{sig.val}% Confidence</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${sig.color} rounded-full transition-all duration-500`} 
                      style={{ width: `${sig.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="font-mono text-[10px] text-slate-400 text-left bg-slate-950 p-2.5 rounded border border-slate-900 font-light leading-relaxed">
              <span className="text-amber-500 font-bold block mb-0.5">Fabric Tip:</span>
              Trust score is re-evaluated live. Running in unauthorized locations or using unknown VPN networks causes score mitigation.
            </p>
          </div>

          {/* AI Security Recommendations Panel */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6 flex flex-col justify-between h-[360px]">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
                <h3 className="font-sans font-bold text-white text-base">Active Recommendations</h3>
              </div>
              <p className="text-xs text-slate-400 font-light mt-0.5">Real-time adaptive mitigations</p>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-4 rounded-lg my-1 flex-1 flex flex-col justify-center">
              {trustData.trustScore >= 85 ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider">Device Status Normal</p>
                      <p className="text-[11px] text-slate-400 font-light mt-1">
                        Biometrics matched expected typing posture. Standard workspace iMac. Geolocation falls within your historic home range of Mumbai.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-slate-900 pt-2 text-[10px] font-mono text-slate-400">
                    💡 <span className="text-white">Tip</span>: Your current activity is considered low-friction. No challenge requested.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-amber-400">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 animate-pulse" />
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider">MFA Challenge Enforced</p>
                      <p className="text-[11px] text-slate-400 font-light mt-1">
                        Unrecognized device or geographic displacement detected outside standard working hours. SMS verification and Hardware Security tokens triggered on your central banking mobile.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-slate-900 pt-2 text-[10px] font-mono text-red-400">
                    ⚠️ <span className="font-bold underline">Warning</span>: Unauthorized logins from unconfirmed devices will be blocked by system governors instantly if SMS token is failed.
                  </div>
                </div>
              )}
            </div>

            <button
              id="btn-trigger-scen-2"
              onClick={() => onTriggerScenario("SCEN_02", "New Device Login")}
              className="w-full text-center rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 px-4 py-2 font-mono text-xs font-bold text-amber-400 border border-amber-500/20 hover:border-amber-500 transition-all"
            >
              Simulate New Unapproved Login
            </button>
          </div>

        </div>

        {/* Explainable AI block - Gemini integrated */}
        <div id="explainable-ai-audit" className="mt-8 rounded-xl border border-amber-500/10 bg-slate-900/20 p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/60 pb-4 mb-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
                <Brain className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-white text-base">Explainable AI Cybersecurity Auditor</h3>
                <p className="text-xs text-slate-400 font-light">Generates explainable transparency reports about your current active trust index</p>
              </div>
            </div>

            <button
              id="btn-customer-explain-ai"
              onClick={handleExplainAI}
              disabled={isExplaining}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-yellow-500 transition-all disabled:opacity-50"
            >
              {isExplaining ? (
                <>
                  <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                  Generating Trust Report...
                </>
              ) : (
                <>
                  <Brain className="h-3.5 w-3.5" />
                  Request Deep Security Audit
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950/80 border border-slate-900 p-5 rounded-lg min-h-[100px]">
            {explainResult ? (
              <div id="ai-audit-output" className="prose text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-w-none">
                {explainResult}
              </div>
            ) : (
              <div className="text-slate-500 font-mono text-xs text-center py-6">
                Click "Request Deep Security Audit" to invoke the TRUSTNETRA Gemini engine and translate risk vectors into an explainable human report.
              </div>
            )}
          </div>
        </div>

        {/* Registered Devices Workspace */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-base font-bold text-white font-sans">
              Registered Devices & Authenticated Environments
            </h3>
            <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded">
              Active Hosts: {devices.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-2 font-semibold">Device Hostname</th>
                  <th className="py-3 px-2 font-semibold">Hardware Type</th>
                  <th className="py-3 px-2 font-semibold font-mono">IP Address</th>
                  <th className="py-3 px-2 font-semibold">Registered Location</th>
                  <th className="py-3 px-2 font-semibold">Last Active</th>
                  <th className="py-3 px-2 font-semibold">Device Score</th>
                  <th className="py-3 px-2 font-semibold">Status</th>
                  <th className="py-3 px-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {devices.map((dev) => (
                  <tr key={dev.id} className="text-slate-300 hover:bg-slate-900/40">
                    <td className="py-3.5 px-2 flex items-center gap-2.5 font-bold">
                      <span className="text-slate-400 shrink-0">{getDeviceIcon(dev.type)}</span>
                      {dev.name}
                      {dev.isNew && (
                        <span className="text-[9px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase">
                          NEW
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-slate-400 text-[11px]">{dev.os}</td>
                    <td className="py-3.5 px-2 text-slate-400 text-[11px]">{dev.ipAddress}</td>
                    <td className="py-3.5 px-2 flex items-center gap-1.5 text-slate-300">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      {dev.location}
                    </td>
                    <td className="py-3.5 px-2 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        {dev.lastActive}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-bold font-mono">
                      <span className={`${
                        dev.trustScore >= 85 ? "text-green-400" : dev.trustScore >= 50 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {dev.trustScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`inline-flex px-2 py-0.5 font-bold text-[10px] rounded uppercase ${
                        dev.status === "TRUSTED"
                          ? "bg-green-500/10 text-emerald-400 border border-emerald-500/15"
                          : dev.status === "REQUIRES_MFA"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                          : "bg-red-500/10 text-red-400 border border-red-500/15"
                      }`}>
                        {dev.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      {dev.status !== "BLOCKED" ? (
                        <button
                          id={`block-device-${dev.id}`}
                          onClick={() => onBlockDevice(dev.id)}
                          className="font-bold text-[10px] text-red-500 hover:text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded px-2.5 py-1 uppercase"
                        >
                          Revoke Authentication
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-bold uppercase py-1 italic block">— REVOKED —</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities workspace */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-base font-bold text-white font-sans">
              Recent Chronology & Trust Audits
            </h3>
            <span className="text-xs text-slate-400">Continuous background logging</span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {activities.map((act) => (
              <div key={act.id} className="flex relative pl-5 py-3 border-l-2 border-slate-800 hover:bg-slate-900/30 rounded-r px-4 transition-colors">
                <div className="absolute -left-[5px] top-4 h-2.5 w-2.5 rounded-full bg-slate-800" />
                <div className="flex-1">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-white">
                        {act.type}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                        act.status === "SUCCESS"
                          ? "bg-green-500/10 text-emerald-400"
                          : act.status === "CHALLENGED"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {act.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500 text-right">
                      <span>{new Date(act.timestamp).toLocaleTimeString()}</span>
                      <span>|</span>
                      <span>{act.location}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-light">{act.details} <span className="text-slate-500 font-mono text-[10px]">({act.device})</span></p>
                </div>
                <div className="ml-4 flex items-center shrink-0">
                  {getSeverityBadge(act.riskScore)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
