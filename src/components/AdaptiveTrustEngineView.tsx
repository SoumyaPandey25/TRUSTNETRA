/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sliders, HelpCircle, Shield, Play, Hourglass, HelpCircle as HelpIcon, Sparkles } from "lucide-react";

interface AdaptiveTrustEngineViewProps {
  trustData: {
    trustScore: number;
    weights: {
      behaviorWeight: number;
      deviceWeight: number;
      transactionWeight: number;
      contextWeight: number;
    };
    breakdown: {
      behaviorScore: number;
      deviceScore: number;
      transactionScore: number;
      contextScore: number;
    };
  };
}

export default function AdaptiveTrustEngineView({ trustData }: AdaptiveTrustEngineViewProps) {
  // Safe extraction of parameters
  const { behaviorWeight, deviceWeight, transactionWeight, contextWeight } = trustData.weights;
  const { behaviorScore, deviceScore, transactionScore, contextScore } = trustData.breakdown;

  // Manual trace equation
  const calculatedSum = Math.round(
    (behaviorScore * (behaviorWeight / 100)) + 
    (deviceScore * (deviceWeight / 100)) + 
    (transactionScore * (transactionWeight / 100)) + 
    (contextScore * (contextWeight / 100))
  );

  return (
    <div id="adaptive-engine-view" className="bg-slate-950 min-h-screen py-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-5 mb-8">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest font-bold">
            Real-time Adaptive Cybersecurity Math
          </span>
          <h2 className="text-2xl font-extrabold text-white font-sans mt-1">
            Adaptive Trust Calculation Fabric
          </h2>
          <p className="text-sm text-slate-400 font-light mt-1">
            Examine how the TRUSTNETRA engine dynamically solves the security coefficient formula in less than a quarter of a millisecond.
          </p>
        </div>

        {/* Dynamic Formula Display */}
        <div className="rounded-xl border border-amber-500/10 bg-slate-900/40 p-8 shadow-[0_4px_30px_rgba(245,158,11,0.02)]">
          <h3 className="font-mono text-xs text-amber-500 font-bold uppercase tracking-wider mb-4 text-center">
            Adaptive Identity scoring equation
          </h3>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 py-6 text-center">
            
            <div className="bg-slate-950 border border-slate-900 px-6 py-4.5 rounded-lg w-full md:w-auto shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">Trust Score</span>
              <span className="text-4xl font-extrabold text-white font-sans">{trustData.trustScore}</span>
            </div>

            <span className="font-mono text-4xl text-amber-500 font-bold">=</span>

            <div className="bg-slate-950/60 border border-slate-900/60 px-5 py-3 rounded-lg w-full md:w-auto">
              <span className="block text-[9px] font-mono text-slate-500 uppercase">Behavior ({behaviorWeight}%)</span>
              <span className="text-lg font-bold text-white font-sans">{behaviorScore} Pts</span>
            </div>

            <span className="font-mono text-xl text-slate-600 font-bold">+</span>

            <div className="bg-slate-950/60 border border-slate-900/60 px-5 py-3 rounded-lg w-full md:w-auto">
              <span className="block text-[9px] font-mono text-slate-500 uppercase">Device ({deviceWeight}%)</span>
              <span className="text-lg font-bold text-white font-sans">{deviceScore} Pts</span>
            </div>

            <span className="font-mono text-xl text-slate-600 font-bold">+</span>

            <div className="bg-slate-950/60 border border-slate-900/60 px-5 py-3 rounded-lg w-full md:w-auto">
              <span className="block text-[9px] font-mono text-slate-500 uppercase">Transaction ({transactionWeight}%)</span>
              <span className="text-lg font-bold text-white font-sans">{transactionScore} Pts</span>
            </div>

            <span className="font-mono text-xl text-slate-600 font-bold">+</span>

            <div className="bg-slate-950/60 border border-slate-900/60 px-5 py-3 rounded-lg w-full md:w-auto">
              <span className="block text-[9px] font-mono text-slate-500 uppercase">Context ({contextWeight}%)</span>
              <span className="text-lg font-bold text-white font-sans">{contextScore} Pts</span>
            </div>

          </div>

          <div className="mt-6 border-t border-slate-800/80 pt-6 text-center text-xs font-mono text-slate-400">
            📊 Verification Formula Yields: <span className="text-amber-500 font-bold"> {calculatedSum} / 100</span> (Rounded to standard integer thresholds).
          </div>
        </div>

        {/* Math & explanation breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-sans">Adaptive Friction Threshold Gates</h3>
            <p className="text-xs text-slate-400 font-light">Based on score indexes, different gate paths are launched instantly:</p>

            <div className="space-y-4 pt-3">
              {[
                { range: "Score 85 - 100", label: "Frictionless Passage (High Trust)", desc: "Allows instant payments and login confirmations with no redundant verification steps. Streamlined UX.", color: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" },
                { range: "Score 60 - 84", label: "Verification Step-Up Challenged", desc: "Flags a mild anomaly. Automatically enforces prompt OTP challenges, voice biometrics, or hardware token validations.", color: "border-amber-500/20 text-amber-400 bg-amber-500/5" },
                { range: "Score 0 - 59", label: "Manual compliance blocking", desc: "Intercepts administrative permissions and flags account takeover. Session is quarantined until manual administrator authorization.", color: "border-red-500/20 text-red-400 bg-red-400/5" }
              ].map((gate) => (
                <div key={gate.range} className={`rounded-lg border p-4 font-mono text-xs ${gate.color}`}>
                  <div className="flex justify-between font-bold">
                    <span>{gate.label}</span>
                    <span className="underline">{gate.range}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1.5 font-light font-sans">{gate.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-sans">Adaptive Decision Tree Logic</h3>
            <p className="text-xs text-slate-400 font-light">How the weights are calculated dynamically under active scenario triggers:</p>

            <div className="space-y-4 pt-3 text-xs font-mono">
              <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg">
                <span className="text-amber-500 font-bold uppercase block mb-1">1. Behavior Entropy Acquisition</span>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  Keystroke hold times and mouse velocity patterns are compared with historically compiled spatial dynamics. If biometric deviation exceeds 40%, the Behavior score scales downward accordingly.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg">
                <span className="text-amber-500 font-bold uppercase block mb-1">2. Cryptographic Device Fingerprint Check</span>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  Secured key strings and canvas entropy hashes are fetched from the browser metadata. Missing keys or virtualization triggers instant device flags.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg">
                <span className="text-amber-500 font-bold uppercase block mb-1">3. Geographical Displacement Bounds</span>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  Coordinates are geolocated and mapped against impossible travel physical constants (e.g. traveling between Mumbai and Lagos inside 20 minutes triggers 100% boundary violation values).
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
