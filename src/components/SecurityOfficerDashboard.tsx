/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldAlert, ShieldX, EyeOff, Radio, Check, 
  Search, Sliders, TrendingUp, AlertTriangle, Fingerprint, Calendar 
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { FraudAlert, UserActivity } from "../types";

interface SecurityOfficerDashboardProps {
  alerts: FraudAlert[];
  activities: UserActivity[];
  onUpdateAlertStatus: (id: string, status: string) => void;
  onTriggerScenario: (id: string, label: string) => void;
}

export default function SecurityOfficerDashboard({
  alerts,
  activities,
  onUpdateAlertStatus,
  onTriggerScenario,
}: SecurityOfficerDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  // Filtered Alerts calculation
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.userId.includes(searchTerm);
    const matchesSeverity = severityFilter === "ALL" || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  // Recharts feed datasets
  const hourlyIncidentData = [
    { hour: "00:00", incidents: 1 },
    { hour: "02:00", incidents: 0 },
    { hour: "04:00", incidents: 3 },
    { hour: "06:00", incidents: alerts.length + 1 },
    { hour: "08:00", incidents: 4 },
    { hour: "10:00", incidents: 2 },
    { hour: "12:00", incidents: 5 },
    { hour: "14:00", incidents: 3 },
  ];

  const threatCategoryData = [
    { name: "ATO Attacks", count: alerts.filter(a => a.title.includes("Takeover")).length + 4 },
    { name: "New Device Risks", count: 8 },
    { name: "KYC Anomalies", count: 3 },
    { name: "System virtualizations", count: 6 },
  ];

  // Find critical/high alerts for scrolling streaming ticker
  const criticalFraudAlerts = alerts.filter(
    (alert) => alert.severity === "CRITICAL" || alert.severity === "HIGH"
  );

  return (
    <div id="officer-dashboard-view" className="bg-slate-950 min-h-screen py-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Officer Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-mono text-xs text-red-500 uppercase tracking-widest font-bold">
                PROACTIVE COMBAT PANEL: SBI NODE
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Incident Response & FRAUD MONITOR
            </h2>
          </div>

          {/* Quick Scenario Triggers inside dashboard */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-500 mr-2 hidden sm:inline uppercase">Sandbox Fast-Track:</span>
            <button
              id="dash-scen-3"
              onClick={() => onTriggerScenario("SCEN_03", "Suspicious Account Recovery")}
              className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 rounded text-[10px] font-mono font-bold text-red-400 transition-colors"
            >
              Trigger Account Takeover (ATO)
            </button>
            <button
              id="dash-scen-4"
              onClick={() => onTriggerScenario("SCEN_04", "Inter-Bank Threat Intelligence Sharing")}
              className="px-2.5 py-1.5 bg-purple-950/45 hover:bg-purple-900/60 border border-purple-500/20 rounded text-[10px] font-mono font-bold text-purple-400 transition-colors"
            >
              Trigger Collaborative Threat Sharing
            </button>
          </div>
        </div>

        {/* Streaming Ticker elements */}
        <div className="mt-6 overflow-hidden rounded-lg border border-red-900/40 bg-red-950/10 flex items-center h-10 w-full relative">
          <div className="flex items-center gap-2 px-3 h-full bg-red-950/90 border-r border-slate-800 text-red-400 font-mono text-[9px] font-extrabold tracking-widest uppercase flex-shrink-0 animate-pulse">
            <AlertTriangle className="h-4 w-4 animate-bounce shrink-0" />
            <span>HEURISTIC LIVE FEED</span>
          </div>

          <div className="flex-1 overflow-hidden relative flex items-center h-full">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-12 pr-12">
              {criticalFraudAlerts.length > 0 ? (
                [...criticalFraudAlerts, ...criticalFraudAlerts].map((al, index) => (
                  <div key={`${al.id}-${index}`} className="inline-flex items-center gap-3 font-mono text-xs">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                      {al.severity}
                    </span>
                    <span className="text-slate-500 font-bold">[{al.bankName}]</span>
                    <span className="text-slate-200 font-bold">{al.title}</span>
                    <span className="text-slate-400 font-light">— Identity: <strong className="text-slate-300 font-semibold">{al.userName}</strong> ({al.userId})</span>
                    <span className="text-amber-500/90 font-light italic text-[11px]">
                      "{al.description}"
                    </span>
                    <span className="text-slate-600 font-light">•</span>
                    <span className="text-[10px] text-slate-500 font-light">
                      {new Date(al.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              ) : (
                [1, 2].map((_, index) => (
                  <div key={index} className="inline-flex items-center gap-3 font-mono text-xs">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      SECURE
                    </span>
                    <span className="text-slate-400 font-bold">SYSTEMS INTEGRATED:</span>
                    <span className="text-slate-400">Continuous heuristics scan live. All PSU node channels fully compliant with RBI protocols. No anomalous high risk vectors detected.</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Analytic Metrics Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
            <span className="text-slate-500 font-mono text-[10px] tracking-widest block uppercase">
              ACTIVE HEURISTIC ALERTS
            </span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-3xl font-extrabold text-white">{alerts.length}</span>
              <span className="text-xs font-mono text-red-400 font-semibold uppercase">Pending review</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full mt-3.5 overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${alerts.length * 20}%` }} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
            <span className="text-slate-500 font-mono text-[10px] tracking-widest block uppercase">
              THREAT INTEGRITY RATIO
            </span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-3xl font-extrabold text-white">99.42%</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">Matched Clean</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full mt-3.5 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "99.4%" }} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
            <span className="text-slate-500 font-mono text-[10px] tracking-widest block uppercase">
              AVG IDENTIFICATION SPEED
            </span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-3xl font-extrabold text-white">124ms</span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">Continuous evaluation</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full mt-3.5 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: "88%" }} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
            <span className="text-slate-500 font-mono text-[10px] tracking-widest block uppercase">
              TIX NODE PEER CHANNELS
            </span>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-3xl font-extrabold text-white">12 / 12</span>
              <span className="text-xs font-mono text-purple-400 font-semibold">Sync Online</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950 rounded-full mt-3.5 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          
          {/* Daily Risk Incident chart */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Heuristic Threat Frequency</h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">Anomalous spikes over last 24h</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Live Feed
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyIncidentData}>
                  <defs>
                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155" }} />
                  <Area type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorIncidents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Incident categories diagram */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Threat Vector Categories</h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">Distribution across banking segments</p>
              </div>
              <span className="text-xs text-slate-500 font-mono">SBI Node v1</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155" }} />
                  <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Real-time incident logs */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Real-Time Risk Alerts & Heuristic Detections
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1">
                Triage incoming validation failures and take compliance action on compromised identities.
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search user ID or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-8 py-2 text-xs font-mono w-full sm:w-60 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded p-1">
                {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSeverityFilter(lvl)}
                    className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold ${
                      severityFilter === lvl
                        ? "bg-amber-500 text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts Grid */}
          <div className="space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((al) => (
                <div 
                  key={al.id} 
                  className={`rounded-lg border p-5 bg-slate-950/80 transition-all ${
                    al.severity === "CRITICAL"
                      ? "border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.03)]"
                      : al.severity === "HIGH"
                      ? "border-amber-500/25"
                      : "border-slate-800"
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded mt-0.5 ${
                        al.severity === "CRITICAL"
                          ? "bg-red-500/10 text-red-500"
                          : al.severity === "HIGH"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-indigo-500/10 text-indigo-400"
                      }`}>
                        <ShieldAlert className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                            al.severity === "CRITICAL" ? "bg-red-500/15 text-red-400" : al.severity === "HIGH" ? "bg-amber-500/15 text-amber-400" : "bg-indigo-500/15 text-indigo-300"
                          }`}>
                            {al.severity} Severity
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {new Date(al.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            ID: {al.id}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1.5">{al.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">{al.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3 bg-slate-900/50 p-2 rounded max-w-fit border border-slate-850">
                          <span className="font-mono text-[10px] text-slate-400">Target User: <span className="text-white font-bold">{al.userName}</span> ({al.userId})</span>
                          <span className="text-slate-700">|</span>
                          <span className="font-mono text-[10px] text-slate-400">Bank Nodes: <span className="text-slate-300">{al.bankName}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-stretch gap-2 w-full md:w-auto shrink-0 border-t border-slate-900 md:border-0 pt-4 md:pt-0">
                      
                      {al.status === "ACTIVE" || al.status === "UNDER_REVIEW" ? (
                        <>
                          <button
                            id={`alert-approve-${al.id}`}
                            onClick={() => onUpdateAlertStatus(al.id, "RESOLVED")}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-[10px] font-bold px-3 py-2 uppercase transition-all"
                          >
                            <Check className="h-3 w-3" />
                            Approve Access
                          </button>
                          
                          <button
                            id={`alert-block-${al.id}`}
                            onClick={() => onUpdateAlertStatus(al.id, "BLOCKED")}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded bg-red-650 hover:bg-red-600 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-bold px-3 py-2 uppercase transition-all"
                          >
                            <ShieldX className="h-3 w-3" />
                            Terminate Session
                          </button>
                        </>
                      ) : (
                        <div className="text-center font-mono text-[10px] p-2 bg-slate-900 text-slate-400 rounded uppercase font-bold tracking-widest border border-slate-850">
                          CLASSIFIED: {al.status}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Trust Weight Signals Detail */}
                  <div className="mt-4 pt-3.5 border-t border-slate-900/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-900/20 p-2.5 rounded border border-slate-900">
                      <span className="font-mono text-[9px] text-slate-500 block uppercase">Behavior Score</span>
                      <span className="font-mono font-bold text-sm text-red-400">{al.signals.behavior}% Deviation</span>
                    </div>
                    <div className="bg-slate-900/20 p-2.5 rounded border border-slate-900">
                      <span className="font-mono text-[9px] text-slate-500 block uppercase">Fingerprint Entropy</span>
                      <span className="font-mono font-bold text-sm text-amber-400">{al.signals.device}% Risk Weight</span>
                    </div>
                    <div className="bg-slate-900/20 p-2.5 rounded border border-slate-900">
                      <span className="font-mono text-[9px] text-slate-500 block uppercase">Transaction Variance</span>
                      <span className="font-mono font-bold text-sm text-indigo-400">{al.signals.transaction}% Scale</span>
                    </div>
                    <div className="bg-slate-900/20 p-2.5 rounded border border-slate-900">
                      <span className="font-mono text-[9px] text-slate-500 block uppercase">Geo-Impossibility index</span>
                      <span className="font-mono font-bold text-sm text-red-500">{al.signals.context}% Match</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 font-mono text-xs">
                No security alerts found matching filter criteria. Sandbox system compliant.
              </div>
            )}
          </div>
        </div>

        {/* Real-time system log stream */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-base font-bold text-white font-sans">
              Dynamic Activity Logs Trace (All PSU Banks)
            </h3>
            <span className="font-mono text-[10px] text-slate-500">Live background stream</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-slate-300">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="py-2.5 px-2">Time</th>
                  <th className="py-2.5 px-2">Account ID</th>
                  <th className="py-2.5 px-2">Client Name</th>
                  <th className="py-2.5 px-2 font-mono">Action</th>
                  <th className="py-2.5 px-2">Hardware Host</th>
                  <th className="py-2.5 px-2">IP Subnet</th>
                  <th className="py-2.5 px-2">Risk Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-900/20">
                    <td className="py-3 px-2 text-slate-500 font-light">{new Date(act.timestamp).toLocaleTimeString()}</td>
                    <td className="py-3 px-2 text-amber-500 font-bold">{act.userId}</td>
                    <td className="py-3 px-2 font-bold text-white">{act.userName}</td>
                    <td className="py-3 px-2">
                      <span className="text-slate-200 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-850">
                        {act.type}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-400 font-light">{act.device}</td>
                    <td className="py-3 px-2 text-slate-400">{act.ipAddress}</td>
                    <td className="py-3 px-2">
                      <span className={`font-bold ${
                        act.riskScore > 80 ? "text-red-500" : act.riskScore > 30 ? "text-amber-500" : "text-emerald-400"
                      }`}>
                        {act.riskScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
