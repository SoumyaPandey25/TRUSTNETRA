/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Settings, Database, CloudLightning, RefreshCw, 
  Plus, Shield, Cpu, Sparkles, Sliders, CheckCircle 
} from "lucide-react";
import { SystemMetrics, AIModelStatus, AdaptiveTrustFormula } from "../types";

interface AdminDashboardProps {
  metrics: SystemMetrics;
  models: AIModelStatus[];
  formula: AdaptiveTrustFormula;
  onUpdateFormula: (weights: AdaptiveTrustFormula) => Promise<{ success: boolean; error?: string }>;
  onRetrainModel: (modelName: string) => void;
}

export default function AdminDashboard({
  metrics,
  models,
  formula,
  onUpdateFormula,
  onRetrainModel,
}: AdminDashboardProps) {
  const [bWeight, setBWeight] = useState(formula.behaviorWeight);
  const [dWeight, setDWeight] = useState(formula.deviceWeight);
  const [tWeight, setTWeight] = useState(formula.transactionWeight);
  const [cWeight, setCWeight] = useState(formula.contextWeight);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const totalWeights = Number(bWeight) + Number(dWeight) + Number(tWeight) + Number(cWeight);

  const handleUpdateWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    if (totalWeights !== 100) {
      setErrorText(`Weights must equal exactly 100%. Currently: ${totalWeights}%`);
      return;
    }

    setIsUpdating(true);
    const res = await onUpdateFormula({
      behaviorWeight: bWeight,
      deviceWeight: dWeight,
      transactionWeight: tWeight,
      contextWeight: cWeight,
    });

    setIsUpdating(false);
    if (res.success) {
      setSuccessText("Adaptive Trust Weights dynamically updated and deployed across all PSU cluster servers successfully.");
    } else {
      setErrorText(res.error || "Failed to update trust coefficients.");
    }
  };

  return (
    <div id="admin-dashboard-view" className="bg-slate-950 min-h-screen py-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="border-b border-slate-800 pb-5 mb-8">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest font-bold">
            Centralized Platform Administration
          </span>
          <h2 className="text-2xl font-extrabold text-white font-sans mt-1">
            Global Systems Configuration & AI Models
          </h2>
          <p className="text-sm text-slate-400 font-light">
            Manage public sector bank instances, fine-tune the adaptive decision policy weighting, and audit machine learning engines.
          </p>
        </div>

        {/* Global Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Active Bank Nodes", val: metrics.totalBanks, desc: "Connected PSU Banks" },
            { label: "Managed Identities", val: metrics.totalUsers, desc: "Across active nodes" },
            { label: "Concurrent Sessions", val: metrics.activeSessions, desc: "Real-time evaluators" },
            { label: "Mitigated Intrusions", val: metrics.fraudAlertsCount, desc: "Isolated threats" },
            { label: "TIX Threat Seeds", val: metrics.threatIntelligenceCount, desc: "Ledger entries shared" }
          ].map((card, idx) => (
            <div key={idx} className="rounded-xl border border-slate-900 bg-slate-900/40 p-4 shrink-0">
              <span className="font-mono text-[9px] uppercase text-slate-500 tracking-wider font-semibold block">{card.label}</span>
              <span className="text-2xl font-extrabold text-white mt-1.5 block">{card.val}</span>
              <span className="text-[10px] text-slate-400 block mt-1 font-light">{card.desc}</span>
            </div>
          ))}
        </div>

        {/* Adaptive Weights Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 lg:col-span-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Sliders className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold text-white font-sans">
                Adaptive Trust Equation 
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-light">
              Fine-tune core mathematical weights. Coefficients are distributed in real-time across participating gateways.
            </p>

            <form onSubmit={handleUpdateWeights} className="space-y-5 mt-6 border-t border-slate-800 pt-5">
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Behavioral Dynamics ({bWeight}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bWeight}
                  onChange={(e) => setBWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 h-1 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Device Integrity ({dWeight}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dWeight}
                  onChange={(e) => setDWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 h-1 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Transaction Variance ({tWeight}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tWeight}
                  onChange={(e) => setTWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 h-1 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Context Displacement ({cWeight}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cWeight}
                  onChange={(e) => setCWeight(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 h-1 rounded-lg"
                />
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between items-center bg-slate-950 p-2.5 rounded">
                <span className="font-mono text-[10px] text-slate-400">Total Sum Coefficient:</span>
                <span className={`font-mono font-bold text-xs ${
                  totalWeights === 100 ? "text-emerald-400" : "text-red-400"
                }`}>
                  {totalWeights}% / 100%
                </span>
              </div>

              {errorText && (
                <p className="text-[10px] font-mono text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 font-bold">
                  ⚠️ {errorText}
                </p>
              )}

              {successText && (
                <p className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20 font-bold">
                  ✓ {successText}
                </p>
              )}

              <button
                type="submit"
                id="btn-admin-save-weights"
                disabled={isUpdating}
                className="w-full text-center rounded-lg bg-amber-500 text-slate-950 px-4 py-2 font-mono text-xs font-bold hover:bg-amber-400 disabled:opacity-50 transition-all uppercase"
              >
                {isUpdating ? "Deploying weights..." : "Apply Equation Configuration"}
              </button>

            </form>
          </div>

          {/* AI Machine learning Models manager */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Cpu className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-white font-sans">
                  AI Model Management & Classifiers
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-light">
                Monitor status thresholds, validation accuracy indexes, and trigger background retraining schedules for your behavioral and supervised models.
              </p>

              <div className="space-y-4 mt-6 border-t border-slate-800 pt-5">
                {models.map((mod) => (
                  <div key={mod.name} className="bg-slate-950/80 border border-slate-900 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">{mod.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono italic block mt-0.5">{mod.type}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-slate-400">
                          Acc: <span className="text-emerald-400 font-extrabold">{mod.accuracy}%</span>
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                          mod.status === "ACTIVE" 
                            ? "bg-green-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                        }`}>
                          {mod.status === "ACTIVE" ? "✓ RUNNING" : "⚙ TRAINING..."}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 border-t border-slate-900 pt-2 text-[10px] font-mono text-slate-500">
                      <span>Ref: {mod.version}</span>
                      <span>Retrained: {mod.lastRetrained}</span>
                      {mod.status === "ACTIVE" ? (
                        <button
                          id={`retrain-${mod.name.replace(/\s+/g, "-").toLowerCase()}`}
                          onClick={() => onRetrainModel(mod.name)}
                          className="font-bold text-[9px] text-amber-500 hover:text-amber-400 uppercase py-0.5 px-2 border border-amber-500/20 hover:bg-amber-500/5 rounded transition-all"
                        >
                          Trigger Sync Train
                        </button>
                      ) : (
                        <span className="text-amber-500 font-bold uppercase animate-pulse">Running Optimizer...</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 font-mono text-[10px] text-slate-500 leading-relaxed font-light">
              💡 <span className="font-bold text-slate-400">Policy directive</span>: RBI guidelines mandate offline model synchronization every 72 hours for PSU banks. Ensure your Isolation Forest models are consistently retrained.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
