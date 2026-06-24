/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation.js";
import LandingPage from "./components/LandingPage.js";
import CustomerDashboard from "./components/CustomerDashboard.js";
import SecurityOfficerDashboard from "./components/SecurityOfficerDashboard.js";
import AdminDashboard from "./components/AdminDashboard.js";
import TIXDashboard from "./components/TIXDashboard.js";
import DigitalTwinView from "./components/DigitalTwinView.js";
import AdaptiveTrustEngineView from "./components/AdaptiveTrustEngineView.js";
import ScenarioSimulator from "./components/ScenarioSimulator.js";

import { 
  User, Device, UserActivity, BehaviorProfile, 
  FraudAlert, ThreatSignature, SystemMetrics, AIModelStatus, AdaptiveTrustFormula, UserRole 
} from "./types.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [currentRole, setCurrentRole] = useState<UserRole>("CUSTOMER");
  
  // Scoring & Data structures in Sync with backend
  const [trustData, setTrustData] = useState<{
    userId: string;
    trustScore: number;
    status: string;
    weights: AdaptiveTrustFormula;
    breakdown: {
      behaviorScore: number;
      deviceScore: number;
      transactionScore: number;
      contextScore: number;
    };
  } | null>(null);

  const [devices, setDevices] = useState<Device[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [threatIntelligence, setThreatIntelligence] = useState<ThreatSignature[]>([]);
  const [anomalyProfile, setAnomalyProfile] = useState<BehaviorProfile | null>(null);
  const [adminAnalytics, setAdminAnalytics] = useState<{
    metrics: SystemMetrics;
    models: AIModelStatus[];
    formula: AdaptiveTrustFormula;
  } | null>(null);

  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // Core background Fetch synchronization with automatic retry
  const syncPlatformData = async (retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // 1. Fetch Session
        const sessionRes = await fetch("/api/auth/session");
        if (!sessionRes.ok) throw new Error(`HTTP ${sessionRes.status}`);
        const sessionData = await sessionRes.json();
        setCurrentUser(sessionData.user);
        setCurrentRole(sessionData.user.role);

        // 2. Fetch Trust Score
        const trustRes = await fetch("/api/trust-score");
        if (!trustRes.ok) throw new Error(`HTTP ${trustRes.status}`);
        const scoreData = await trustRes.json();
        setTrustData(scoreData);

        // 3. Fetch Devices
        const devRes = await fetch("/api/devices");
        if (!devRes.ok) throw new Error(`HTTP ${devRes.status}`);
        const devList = await devRes.json();
        setDevices(devList);

        // 4. Fetch Activities
        const actRes = await fetch("/api/user-activity");
        if (!actRes.ok) throw new Error(`HTTP ${actRes.status}`);
        const actList = await actRes.json();
        setActivities(actList);

        // 5. Fetch Fraud Alerts
        const alertsRes = await fetch("/api/fraud-alerts");
        if (!alertsRes.ok) throw new Error(`HTTP ${alertsRes.status}`);
        const alertsList = await alertsRes.json();
        setFraudAlerts(alertsList);

        // 6. Fetch Threat Feed
        const threatsRes = await fetch("/api/threat-intelligence");
        if (!threatsRes.ok) throw new Error(`HTTP ${threatsRes.status}`);
        const threatsList = await threatsRes.json();
        setThreatIntelligence(threatsList);

        // 7. Fetch Anomaly Profiles
        const anomalyRes = await fetch("/api/anomaly-detection");
        if (!anomalyRes.ok) throw new Error(`HTTP ${anomalyRes.status}`);
        const anomalyData = await anomalyRes.json();
        setAnomalyProfile(anomalyData);

        // 8. Fetch Admin Analytics
        const adminRes = await fetch("/api/admin/analytics");
        if (!adminRes.ok) throw new Error(`HTTP ${adminRes.status}`);
        const adminData = await adminRes.json();
        setAdminAnalytics(adminData);

        return; // Success, break out
      } catch (e) {
        console.warn(`Fetch attempt ${attempt} failed:`, e);
        if (attempt === retries) {
          console.error("Failed to compile cloud security metrics:", e);
        } else {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  };

  useEffect(() => {
    syncPlatformData();
  }, []);

  // Action: Switch Actor Role
  const handleRoleChange = async (role: UserRole) => {
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentRole(role);
        // Reset view tab to respective dashboard focus
        if (role === "CUSTOMER") {
          setActiveTab("customer-dash");
        } else if (role === "SECURITY_OFFICER") {
          setActiveTab("officer-dash");
        } else if (role === "ADMIN") {
          setActiveTab("admin-dash");
        }
        await syncPlatformData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Run active scenario trigger and coordinate view redirects
  const handleTriggerScenario = async (scenarioId: string, label: string) => {
    setActiveScenario(label);
    try {
      const res = await fetch("/api/scenarios/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId })
      });
      const data = await res.json();
      if (data.success) {
        // Redirection mapping based on scenario to guide user experience
        if (scenarioId === "SCEN_01") {
          // Safe customer access
          await handleRoleChange("CUSTOMER");
          setActiveTab("customer-dash");
        } else if (scenarioId === "SCEN_02") {
          // Step-Up SMS/Token challenge active
          await handleRoleChange("CUSTOMER");
          setActiveTab("customer-dash");
        } else if (scenarioId === "SCEN_03") {
          // Account takeover blocked by officer
          await handleRoleChange("SECURITY_OFFICER");
          setActiveTab("officer-dash");
        } else if (scenarioId === "SCEN_04") {
          // Inter-bank threat intelligence sharing matched
          await handleRoleChange("SECURITY_OFFICER");
          setActiveTab("tix-exchange");
        }
        await syncPlatformData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setActiveScenario(null), 1000);
    }
  };

  // Action: Block specific browser instance
  const handleBlockDevice = async (deviceId: string) => {
    try {
      const res = await fetch("/api/devices/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId })
      });
      const data = await res.json();
      if (data.success) {
        await syncPlatformData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Triage Alerts status (Verify, Approve, Block)
  const handleUpdateAlertStatus = async (alertId: string, status: string) => {
    try {
      const res = await fetch("/api/fraud-alerts/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, status })
      });
      const data = await res.json();
      if (data.success) {
        await syncPlatformData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Action: Contribute new threat signature to TIX ledger
  const handleShareThreat = async (threat: Omit<ThreatSignature, "id" | "reportedBy" | "reportedAt" | "activeMatches">) => {
    try {
      const res = await fetch("/api/threat-intelligence/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(threat)
      });
      const data = await res.json();
      if (data.success) {
        await syncPlatformData();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e?.message || "Cloud connection failure" };
    }
  };

  // Action: Fine-tune Trust equation coefficient percentages
  const handleUpdateFormula = async (weights: AdaptiveTrustFormula) => {
    try {
      const res = await fetch("/api/admin/update-formula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weights)
      });
      const data = await res.json();
      if (data.success) {
        await syncPlatformData();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e?.message || "Platform configuration transmission blocked" };
    }
  };

  // Action: Retrain unsupervised/supervised AI models
  const handleRetrainModel = async (modelName: string) => {
    try {
      const res = await fetch("/api/admin/retrain-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName })
      });
      const data = await res.json();
      if (data.success) {
        await syncPlatformData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartDemo = (role: UserRole, initialTab: string) => {
    handleRoleChange(role);
    setActiveTab(initialTab);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased overflow-x-hidden selection:bg-amber-500/30 selection:text-white">
      
      {/* Platform Navigation */}
      <Navigation
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        trustScore={trustData?.trustScore || 100}
      />

      {/* Main Tab Controller Routing */}
      <main className="min-h-[calc(100vh-64px)]">
        {activeTab === "landing" && (
          <LandingPage 
            onStartDemo={handleStartDemo} 
            onTriggerScenario={handleTriggerScenario}
            activeScenario={activeScenario}
          />
        )}

        {activeTab === "simulator" && trustData && (
          <ScenarioSimulator
            trustData={trustData}
            devices={devices}
            activities={activities}
            anomalyProfile={anomalyProfile}
            threatIntelligence={threatIntelligence}
            onTriggerScenario={async (scenarioId: string, label: string) => {
              try {
                await fetch("/api/scenarios/run", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ scenarioId })
                });
                await syncPlatformData();
              } catch (e) {
                console.error("Failed to run simulation scenario:", e);
              }
            }}
          />
        )}

        {activeTab === "customer-dash" && trustData && anomalyProfile && (
          <CustomerDashboard
            trustData={trustData}
            devices={devices}
            activities={activities}
            anomalyProfile={anomalyProfile}
            onBlockDevice={handleBlockDevice}
            onRefreshData={syncPlatformData}
            onTriggerScenario={handleTriggerScenario}
          />
        )}

        {activeTab === "officer-dash" && (
          <SecurityOfficerDashboard
            alerts={fraudAlerts}
            activities={activities}
            onUpdateAlertStatus={handleUpdateAlertStatus}
            onTriggerScenario={handleTriggerScenario}
          />
        )}

        {activeTab === "admin-dash" && adminAnalytics && (
          <AdminDashboard
            metrics={adminAnalytics.metrics}
            models={adminAnalytics.models}
            formula={adminAnalytics.formula}
            onUpdateFormula={handleUpdateFormula}
            onRetrainModel={handleRetrainModel}
          />
        )}

        {activeTab === "tix-exchange" && (
          <TIXDashboard
            threats={threatIntelligence}
            onShareThreat={handleShareThreat}
          />
        )}

        {activeTab === "digital-twin" && anomalyProfile && (
          <DigitalTwinView 
            anomalyProfile={anomalyProfile}
          />
        )}

        {activeTab === "adaptive-engine" && trustData && (
          <AdaptiveTrustEngineView 
            trustData={trustData}
          />
        )}
      </main>

      {/* Corporate footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 TRUSTNETRA Trust Fabric Network. Protected under RBI Cybersecurity Framework Guidelines.</p>
        <p className="mt-2 text-[10px] text-slate-600">Enterprise SaaS Platform Node ID: {currentUser?.id || "N/A"}</p>
      </footer>

    </div>
  );
}
