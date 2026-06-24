/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Plus, RefreshCw, Radio, Server, Shield, 
  MapPin, Clock, Trash2, Heart, CircleCheck 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ThreatSignature } from "../types";

interface TIXDashboardProps {
  threats: ThreatSignature[];
  onShareThreat: (threat: Omit<ThreatSignature, "id" | "reportedBy" | "reportedAt" | "activeMatches">) => Promise<{ success: boolean; error?: string }>;
}

export default function TIXDashboard({ threats, onShareThreat }: TIXDashboardProps) {
  const [val, setVal] = useState("");
  const [indicatorType, setIndicatorType] = useState<"IP_ADDRESS" | "DEVICE_FINGERPRINT">("IP_ADDRESS");
  const [weight, setWeight] = useState(80);
  const [desc, setDesc] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorWord, setErrorWord] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setErrorWord(null);

    if (!val) {
      setErrorWord("Please insert a valid target signature value (such as an IP subnet or hash string).");
      return;
    }

    const res = await onShareThreat({
      indicatorType,
      signatureValue: val,
      riskWeight: weight,
      description: desc || "Auto flagged during local sandbox interaction"
    });

    if (res.success) {
      setSuccess(true);
      setVal("");
      setDesc("");
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setErrorWord(res.error || "Failed to transmit threat token.");
    }
  };

  // Recharts Participation metrics dataset
  const pData = [
    { name: "SBI Nodes", reported: threats.filter(t => t.reportedBy.includes("SBI") || t.reportedBy.includes("State")).length + 4 },
    { name: "Canara Bank", reported: threats.filter(t => t.reportedBy.includes("Canara")).length + 3 },
    { name: "PNB Gateways", reported: threats.filter(t => t.reportedBy.includes("Punjab") || t.reportedBy.includes("PNB")).length + 2 },
    { name: "Bank of Baroda", reported: threats.filter(t => t.reportedBy.includes("Baroda")).length + 1 },
  ];

  return (
    <div id="tix-dashboard-view" className="bg-slate-950 min-h-screen py-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* TIX Header */}
        <div className="border-b border-slate-800 pb-5 mb-8">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest font-bold flex items-center gap-1">
            <Radio className="h-3 w-3 text-red-500 animate-ping shrink-0" />
            Active Trust Intelligence Exchange (TIX) Network
          </span>
          <h2 className="text-2xl font-extrabold text-white font-sans mt-1">
            Inter-Bank Threat Seed Interchange
          </h2>
          <p className="text-sm text-slate-400 font-light mt-1">
            Collaborative security layer for public sector banks. Instantly transmit blacklisted IP nodes, spoofed device finger-prints, and malicious botnet details.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Share threat configuration section */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 lg:col-span-1 h-fit">
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold text-white">Broadcast New Threat</h3>
            </div>
            <p className="text-xs text-slate-400 font-light">
              Anonymously broadcast an IOC signature token to all peer nodes instantly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 border-t border-slate-800/80 pt-5 space-y-4">
              
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-slate-400 font-semibold">Indicator Type</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setIndicatorType("IP_ADDRESS")}
                    className={`px-3 py-2 font-mono text-[10px] font-bold rounded border ${
                      indicatorType === "IP_ADDRESS"
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    IP Subnet Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndicatorType("DEVICE_FINGERPRINT")}
                    className={`px-3 py-2 font-mono text-[10px] font-bold rounded border ${
                      indicatorType === "DEVICE_FINGERPRINT"
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    Device Fingerprint
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-slate-400 font-semibold block">Signature Value</label>
                <input
                  type="text"
                  placeholder={indicatorType === "IP_ADDRESS" ? "e.g., 185.220.101.4" : "e.g., D_F_3B8929A1009C72"}
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded p-2.5 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-slate-400 font-semibold block">Threat weight ({weight}%)</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-1 accent-amber-500 bg-slate-950 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase text-slate-400 font-semibold block">Context Description</label>
                <textarea
                  placeholder="Insert threat vectors, spoof tracking variables, or malicious activity triggers..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded p-2.5 font-mono text-xs focus:outline-none resize-none"
                />
              </div>

              {errorWord && (
                <p className="text-[10px] font-mono text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                  {errorWord}
                </p>
              )}

              {success && (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-2.5 rounded border border-emerald-500/25 font-mono text-[10px] font-bold">
                  <CircleCheck className="h-4 w-4 shrink-0" />
                  Broadcast complete. Synchronized instantly.
                </div>
              )}

              <button
                type="submit"
                id="btn-tix-broadcast"
                className="w-full text-center rounded-lg bg-amber-500 text-slate-950 px-4 py-2 font-mono text-xs font-bold hover:bg-amber-400 transition-all uppercase"
              >
                Broadcast to Peer Network
              </button>

            </form>
          </div>

          {/* List of active Threat Feed signals */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Participation statistics charts summary */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
              <h3 className="text-base font-bold text-white font-sans mb-1">
                PSU Bank Node Contributions
              </h3>
              <p className="text-xs text-slate-400 font-light mb-4">Quantity of anonymous threats shared by each participating bank cluster</p>
              
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155" }} />
                    <Bar dataKey="reported" fill="#D4AF37" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List entries layout */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                <h3 className="text-base font-bold text-white font-sans">
                  Active Trust Ledger Feed
                </h3>
                <span className="font-mono text-[10px] text-slate-500">Live peer-shared inputs ({threats.length})</span>
              </div>

              <div className="space-y-4 max-h-[360px] overflow-y-auto">
                {threats.map((t) => (
                  <div key={t.id} className="bg-slate-950 border border-slate-905 border-slate-900 rounded-lg p-4 font-mono text-xs">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                            t.indicatorType === "IP_ADDRESS" ? "bg-cyan-500/10 text-cyan-400" : "bg-purple-500/10 text-purple-300"
                          }`}>
                            {t.indicatorType === "IP_ADDRESS" ? "IP SUBNET" : "HARDWARE COMPACT"}
                          </span>
                          <span className="font-bold text-slate-200">{t.signatureValue}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-light font-sans">{t.description}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-bold">
                          Risk Weight: {t.riskWeight}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-slate-900/80 flex justify-between items-center text-slate-500 text-[10px]">
                      <span>Source Peer: <span className="text-slate-300">{t.reportedBy}</span></span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-600" />
                        {new Date(t.reportedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
