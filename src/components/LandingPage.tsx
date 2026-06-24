/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ShieldCheck, AlertOctagon, RefreshCw, Zap, 
  Cpu, Users, Database, Fingerprint, Compass, ArrowRight, Activity 
} from "lucide-react";

interface LandingPageProps {
  onStartDemo: (role: "CUSTOMER" | "SECURITY_OFFICER" | "ADMIN", initialTab: string) => void;
  onTriggerScenario: (scenarioId: string, label: string) => void;
  activeScenario: string | null;
}

export default function LandingPage({ onStartDemo, onTriggerScenario, activeScenario }: LandingPageProps) {
  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/5 blur-[120px]" />
      <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-slate-900 blur-3xl" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-24 text-center sm:px-6 lg:px-8">
        <div id="hero-badge" className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 backdrop-blur-sm">
          <ShieldCheck className="h-4 w-4 text-amber-500 animate-pulse" />
          <span className="font-mono text-xs font-semibold tracking-wide text-amber-400">
            SECURE ADAPTIVE FABRIC FOR PUBLIC SECTOR BANKS
          </span>
        </div>

        <h1 id="hero-title" className="mt-8 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          TRUST<span className="text-amber-500">NETRA</span>
        </h1>
        
        <p id="hero-subtitle" className="mx-auto mt-4 max-w-3xl text-sm sm:text-xl font-light leading-relaxed">
          Adaptive Identity Trust Fabric for Public Sector Banks<br />
          From One-Time Authentication to Continuous Identity Trust.
        </p>

        

        {/* Demo Call To Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            id="btn-customer-portal"
            onClick={() => onStartDemo("CUSTOMER", "customer-dash")}
            className="flex items-center gap-2.5 rounded-lg bg-amber-500 px-6 py-3.5 font-mono text-sm font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:scale-[1.01]"
          >
            Access Customer Portal
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            id="btn-officer-console"
            onClick={() => onStartDemo("SECURITY_OFFICER", "officer-dash")}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-6 py-3.5 font-mono text-sm font-medium text-slate-200 hover:bg-slate-850 hover:border-slate-700 transition-all"
          >
            Open Officer Command Desk
          </button>
        </div>

        {/* interactive simulation sandbox */}
        <div id="simulation-scenarios-panel" className="mt-16 rounded-xl border border-slate-800/80 bg-slate-900/30 p-6 backdrop-blur-sm text-left max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-4 gap-2">
            <div>
              <span className="font-mono text-xs text-amber-500 font-bold uppercase tracking-wider">
                Live Interactive Sandbox
              </span>
              <h3 className="text-lg font-bold text-white font-sans">
                Trigger Threat Scenarios & Watch Trust Scores Re-evaluate
              </h3>
            </div>
            {activeScenario && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs text-amber-400 border border-amber-500/20">
                <Activity className="h-3 w-3 animate-spin" />
                Active Scenario: {activeScenario}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
            <button
              id="scenario-1-button"
              onClick={() => onTriggerScenario("SCEN_01", "Legitimate Customer Access")}
              className="flex flex-col text-left p-4 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-mono text-xs font-bold text-emerald-400">Scenario 1</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Safe Case</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">Legitimate Customer Access</h4>
              <p className="text-xs text-slate-400 mt-1 font-light">
                Verifies bio-metrics, secure subnet matching, and expected hours. Resulting Trust Score 95. Approved.
              </p>
            </button>

            <button
              id="scenario-2-button"
              onClick={() => onTriggerScenario("SCEN_02", "New Device Login")}
              className="flex flex-col text-left p-4 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-mono text-xs font-bold text-amber-400">Scenario 2</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">Adaptive Step-Up</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">New Device Login Profile</h4>
              <p className="text-xs text-slate-400 mt-1 font-light">
                Device replacement & geographic deviation registered from Windows Client. Action: Issue Real-time MFA challenge.
              </p>
            </button>

            <button
              id="scenario-3-button"
              onClick={() => onTriggerScenario("SCEN_03", "Suspicious Account Recovery")}
              className="flex flex-col text-left p-4 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-red-500/30 transition-all group"
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-mono text-xs font-bold text-red-500">Scenario 3</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded">ATO Attempt</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">Anomalous Account Recovery</h4>
              <p className="text-xs text-slate-400 mt-1 font-light">
                Submitted from emulator with travel displacement. Resulting Trust Score 30. Action: Trigger active intercept log.
              </p>
            </button>

            <button
              id="scenario-4-button"
              onClick={() => onTriggerScenario("SCEN_04", "Inter-Bank Threat Intelligence Sharing")}
              className="flex flex-col text-left p-4 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/30 transition-all group"
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-mono text-xs font-bold text-purple-400">Scenario 4</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded">TIX Collaborative</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">Threat Intelligence Sharing</h4>
              <p className="text-xs text-slate-400 mt-1 font-light">
                Participating Bank shares malicious credential-stuffing node IP. Automatically intercepts matches.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grids */}
      <section className="bg-slate-900/40 border-t border-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-mono text-xs font-bold tracking-widest text-amber-500 uppercase">
              REVOLUTIONARY IDENTITY ARCHITECTURE
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-white">
              Securing the Public Sector Banking Network
            </h3>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-500">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-white">Identity Digital Twin</h4>
              <p className="mt-2 text-sm text-slate-400 font-light">
                Continuous background behavioral modeling comparing real-time interactions with historic user baseline metrics.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-500">
                <Cpu className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-white">Adaptive Trust Engine</h4>
              <p className="mt-2 text-sm text-slate-400 font-light">
                Continuous multi-variable risk weight synthesis combining keyboard dynamics, hardware components, and transaction metrics.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-500">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-white">Trust Intelligence Exchange</h4>
              <p className="mt-2 text-sm text-slate-400 font-light">
                A shared, anonymous ledger enabling public sector institutions to exchange device and IP signatures inside seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-mono text-xs font-bold tracking-widest text-amber-500 uppercase">
              CRITICAL MITIGATION THREAT VECTORS
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-white">
              Defense Against Advanced Banking Fraud
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "ato", title: "Account Takeover (ATO)", desc: "Halts hijackers logging in using valid credentials via unrecognized locations, spoofed systems, or high-risk VPN channels." },
              { id: "kyc", title: "KYC Onboarding Fraud", desc: "Interrupts malicious syndicate actors attempting to instantiate synthetic checking accounts with tampered device tokens." },
              { id: "insider", title: "Insider Threats", desc: "Monitors and intercepts privileged banking employees exhibiting highly anomalous access patterns or unexpected data exports." },
              { id: "recovery", title: "Anomalous Account Recovery", desc: "Guards delicate recovery workflows (SMS, email resets) from targeted Sim-Swap and remote access hijacking schemes." },
              { id: "device", title: "New Device Infection", desc: "Identifies system virtualization, root profiles, emulators, and dynamic debugging software used by cybercriminals." },
              { id: "priv", title: "Privileged Access Abuse", desc: "Continuously challenges database and credential administrative actions according to active operational status." }
            ].map((prob) => (
              <div key={prob.id} className="rounded-lg border border-slate-800 bg-slate-900/20 p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="h-5 w-5 text-amber-500/70" />
                  <h4 className="text-base font-bold text-white">{prob.title}</h4>
                </div>
                <p className="mt-2.5 text-xs text-slate-400 leading-relaxed font-light">{prob.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Design Workflow */}
      <section className="bg-slate-900/30 border-t border-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white font-sans">
              TRUSTNETRA Core Pipeline Workflow
            </h3>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            {[
              { num: "01", name: "User Channel", icon: Users },
              { num: "02", name: "Trust Signal Acquisition", icon: Fingerprint },
              { num: "03", name: "Identity Digital Twin", icon: Database },
              { num: "04", name: "Adaptive Trust Synthesis", icon: Zap },
              { num: "05", name: "Collaborative TIX Feed", icon: Compass }
            ].map((step, idx, arr) => (
              <React.Fragment key={step.num}>
                <div className="flex-1 rounded-xl bg-slate-950 p-5 border border-slate-800 w-full md:w-auto relative shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="absolute top-2.5 right-3 font-mono text-[10px] text-amber-500 font-bold">{step.num}</span>
                  <div className="flex justify-center text-slate-400 mb-2">
                    <step.icon className="h-6 w-6 text-amber-400/80" />
                  </div>
                  <h5 className="font-mono text-xs font-semibold text-white tracking-wide">{step.name}</h5>
                </div>
                {idx < arr.length - 1 && (
                  <div className="text-amber-500/40 text-xl font-bold rotate-90 md:rotate-0">
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Indicators */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6">
              <p className="text-4xl font-extrabold text-white font-sans sm:text-5xl">70%</p>
              <p className="mt-2 font-mono text-xs text-slate-400 uppercase tracking-widest">Fraud Reduction</p>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6">
              <p className="text-4xl font-extrabold text-white font-sans sm:text-5xl">50%</p>
              <p className="mt-2 font-mono text-xs text-slate-400 uppercase tracking-widest">Faster Detection</p>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6">
              <p className="text-4xl font-extrabold text-white font-sans sm:text-5xl">90%</p>
              <p className="mt-2 font-mono text-xs text-slate-400 uppercase tracking-widest">Decision Accuracy</p>
            </div>
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-6">
              <p className="text-4xl font-extrabold text-white font-sans sm:text-5xl">Real-Time</p>
              <p className="mt-2 font-mono text-xs text-slate-400 uppercase tracking-widest">Continuous Audit</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
