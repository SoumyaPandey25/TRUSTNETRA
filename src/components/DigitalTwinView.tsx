/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Users, Activity, Brain, Clock, MapPin, 
  CreditCard, Smartphone, CheckCircle, AlertTriangle 
} from "lucide-react";

interface DigitalTwinViewProps {
  anomalyProfile: {
    userId: string;
    loginTimePattern: string;
    deviceUsagePattern: string;
    transactionPattern: string;
    locationPattern: string;
    expectedLoginHours: number[];
    currentLoginHour: number;
    expectedLocation: string;
    currentLocation: string;
    anomalyScore: number;
    explanation: string;
  };
}

export default function DigitalTwinView({ anomalyProfile }: DigitalTwinViewProps) {
  // Check active anomaly severity
  const severity = anomalyProfile.anomalyScore > 0.8 
    ? "CRITICAL" 
    : anomalyProfile.anomalyScore > 0.4 
    ? "WARNING" 
    : "STABLE";

  return (
    <div id="digital-twin-view" className="bg-slate-950 min-h-screen py-8 text-slate-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-5 mb-8">
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest font-bold">
            Continuous Behavior Twin Modeling
          </span>
          <h2 className="text-2xl font-extrabold text-white font-sans mt-1">
            Identity Digital Twin Ledger
          </h2>
          <p className="text-sm text-slate-400 font-light mt-1">
            Visual representation of your historical behavioral baseline. Real-time connections are continually validated against this profile using Isolation Forest algorithms.
          </p>
        </div>

        {/* Top Anomaly Gauge Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 lg:col-span-1 flex flex-col justify-between h-[300px]">
            <div>
              <h3 className="text-base font-bold text-white font-sans">Anomaly Deviation Index</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Calculated by our behavioral dynamics engine</p>
            </div>

            <div className="text-center my-4">
              <span className={`text-6xl font-extrabold font-sans ${
                severity === "CRITICAL" ? "text-red-500" : severity === "WARNING" ? "text-amber-400" : "text-emerald-400"
              }`}>
                {(anomalyProfile.anomalyScore * 100).toFixed(0)}%
              </span>
              <span className="block font-mono text-[10px] tracking-widest text-slate-500 uppercase mt-2">
                DEVIATION AMPLITUDE
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-900 rounded p-3 text-center">
              <span className={`font-mono text-xs font-bold leading-none ${
                severity === "CRITICAL" ? "text-red-400" : severity === "WARNING" ? "text-amber-400" : "text-emerald-400"
              }`}>
                {severity === "CRITICAL" ? "🔴 COMPROMISED POSTURE" : severity === "WARNING" ? "🟡 ANOMALOUS PATHWAY" : "🟢 PERFECT BASLINE SYNC"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 lg:col-span-2 flex flex-col justify-between h-[300px]">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                <Brain className="h-5 w-5 text-amber-500 animate-spin" />
                <h3 className="text-base font-bold text-white font-sans">Explainable Anomaly Summary</h3>
              </div>
              <p className="text-xs text-slate-400 font-light">Direct translation from the core isolation model</p>
            </div>

            <div className="bg-slate-950 border border-slate-900 p-4 rounded-lg my-3 flex-1 flex items-center">
              <p className="font-mono text-xs text-slate-300 leading-relaxed font-light">
                {anomalyProfile.explanation}
              </p>
            </div>

            <p className="font-mono text-[10px] text-slate-500">
              ⚡ Baseline dynamically recalibrates every 24 hours based on authenticated interactions on verified devices.
            </p>
          </div>

        </div>

        {/* Detailed Baseline Vectors Grid */}
        <h3 className="text-base font-bold text-white font-sans mt-10 mb-4">
          Heuristic Baseline Verification Map
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Hour and posture comparisons */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-6">
            
            {/* Hour comparison log */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-amber-500" />
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Access Timing Baseline</h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Weight: 30%</span>
              </div>
              
              <div className="bg-slate-950 rounded-lg p-4 space-y-2 border border-slate-900 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Hours:</span>
                  <span className="text-slate-200">09:00 - 18:00 (Office window)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Login Hour:</span>
                  <span className={`${anomalyProfile.currentLoginHour > 18 || anomalyProfile.currentLoginHour < 9 ? "text-red-400 font-bold" : "text-emerald-400"}`}>
                    {anomalyProfile.currentLoginHour}:00 HRS
                  </span>
                </div>
              </div>
            </div>

            {/* Device Posture */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4.5 w-4.5 text-amber-500" />
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Hardware Posture Baseline</h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Weight: 30%</span>
              </div>
              
              <div className="bg-slate-950 rounded-lg p-4 space-y-2 border border-slate-900 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Approved Hardware Token:</span>
                  <span className="text-emerald-400 font-semibold">Matched (SecureEnclave Active)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Baseline Template Index:</span>
                  <span className="text-slate-300">Apple Silicon ARM iMac, standard Safari</span>
                </div>
                <p className="text-[10px] text-slate-500 border-t border-slate-900 pt-2 font-mono">
                  Current connection info: "{anomalyProfile.deviceUsagePattern}"
                </p>
              </div>
            </div>

          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-6">
            
            {/* Geolocation mapping */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4.5 w-4.5 text-amber-500" />
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Geographic Boundary Profile</h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Weight: 20%</span>
              </div>
              
              <div className="bg-slate-950 rounded-lg p-4 space-y-2 border border-slate-900 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-light">Expected Region:</span>
                  <span className="text-slate-200">{anomalyProfile.expectedLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-light">Detected Coordinates:</span>
                  <span className={`${anomalyProfile.currentLocation !== anomalyProfile.expectedLocation ? "text-red-400 font-bold" : "text-emerald-400"}`}>
                    {anomalyProfile.currentLocation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-light">Velocity Limit check:</span>
                  <span className={`${anomalyProfile.currentLocation !== anomalyProfile.expectedLocation ? "text-red-400 font-bold" : "text-emerald-400"}`}>
                    {anomalyProfile.currentLocation !== anomalyProfile.expectedLocation ? "⚠️ VIOLATED (Impossible travel)" : "✓ Compliant (Normal speeds)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial dynamics */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4.5 w-4.5 text-amber-500" />
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Transaction Posture baseline</h4>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Weight: 20%</span>
              </div>
              
              <div className="bg-slate-950 rounded-lg p-4 space-y-2 border border-slate-900 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Regular transaction range:</span>
                  <span className="text-slate-200">₹1,000 to ₹150,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Typical Payees:</span>
                  <span className="text-slate-200">Whitelisted Utilities, Domestic Payroll</span>
                </div>
                <p className="text-[10px] text-slate-500 border-t border-slate-900 pt-2 font-mono">
                  Variance check: "{anomalyProfile.transactionPattern}"
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
