/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { 
  User, Device, UserActivity, BehaviorProfile, 
  FraudAlert, ThreatSignature, SystemMetrics, AIModelStatus, AdaptiveTrustFormula 
} from "./src/types.js";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

// Central Database In-Memory State
let activeRole: "CUSTOMER" | "SECURITY_OFFICER" | "ADMIN" = "CUSTOMER";

const currentUser: User = {
  id: "U-48291",
  name: "Hari Narayanan",
  email: "hari.narayanan@customer-sbi.co.in",
  role: "CUSTOMER",
  bankId: "B-SBI",
  bankName: "State Bank of India",
  trustScore: 92,
  status: "TRUSTED"
};

let userDevices: Device[] = [
  {
    id: "DEV-01",
    name: "SBI-Issued Workspace iMac",
    type: "DESKTOP",
    os: "macOS Ventura 13.5",
    ipAddress: "203.45.112.89",
    location: "Mumbai, IN",
    lastActive: "15 mins ago",
    trustScore: 98,
    status: "TRUSTED",
    isNew: false
  },
  {
    id: "DEV-02",
    name: "iPhone 15 Pro Max (SecureEnclave)",
    type: "MOBILE",
    os: "iOS 17.4",
    ipAddress: "49.36.81.214",
    location: "Mumbai, IN",
    lastActive: "Just now",
    trustScore: 95,
    status: "TRUSTED",
    isNew: false
  }
];

let userActivities: UserActivity[] = [
  {
    id: "ACT-001",
    userId: "U-48291",
    userName: "Hari Narayanan",
    type: "LOGIN",
    timestamp: "2026-06-18T05:10:00Z",
    status: "SUCCESS",
    location: "Mumbai, IN",
    ipAddress: "49.36.81.214",
    device: "iPhone 15 Pro Max",
    details: "Fingerprint biometrics validated successfully.",
    riskScore: 5
  },
  {
    id: "ACT-002",
    userId: "U-48291",
    userName: "Hari Narayanan",
    type: "TRANSACTION",
    timestamp: "2026-06-18T06:05:00Z",
    status: "SUCCESS",
    location: "Mumbai, IN",
    ipAddress: "49.36.81.214",
    device: "iPhone 15 Pro Max",
    details: "Recurring utility payment: ₹12,450 to TNEB.",
    riskScore: 8
  }
];

let behaviorProfile: BehaviorProfile = {
  userId: "U-48291",
  loginTimePattern: "Expected: 09:00 - 18:00 (Office Hours)",
  deviceUsagePattern: "Primary: iOS & macOS. Trust Level 95%+",
  transactionPattern: "Low variance payroll & regular domestic utility bills",
  locationPattern: "Standard Region: Mumbai & Pune, IN",
  expectedLoginHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  currentLoginHour: 14,
  expectedLocation: "Mumbai, IN",
  currentLocation: "Mumbai, IN",
  anomalyScore: 0.04,
  explanation: "Expected behavior match high. Standard login timing, regular IP subnet range from Jio Network, secure hardware token validated."
};

let fraudAlerts: FraudAlert[] = [
  {
    id: "AL-9201",
    userId: "U-11209",
    userName: "Vikram Sen",
    bankId: "B-SBI",
    bankName: "State Bank of India",
    title: "Suspicious Recovery from Clean System",
    severity: "HIGH",
    status: "ACTIVE",
    timestamp: "2026-06-18T06:50:00Z",
    description: "Account recovery requested with high geographical deviation (Registered Mumbai, requested Sofia, BG). High behavioral entropy detected.",
    signals: { behavior: 85, device: 50, transaction: 10, context: 95 }
  },
  {
    id: "AL-9202",
    userId: "U-33291",
    userName: "Preeti Patil",
    bankId: "B-PNB",
    bankName: "Punjab National Bank",
    title: "Anomalous Transaction Volume",
    severity: "MEDIUM",
    status: "UNDER_REVIEW",
    timestamp: "2026-06-18T06:12:00Z",
    description: "Multi-layered instant payments initiated on a root-compromised Android emulator outside standard working hours.",
    signals: { behavior: 40, device: 90, transaction: 75, context: 60 }
  }
];

let threatIntelligence: ThreatSignature[] = [
  {
    id: "TIX-101",
    indicatorType: "IP_ADDRESS",
    signatureValue: "185.220.101.4",
    reportedBy: "Bank of Baroda",
    reportedAt: "2026-06-18T04:30:00Z",
    riskWeight: 95,
    description: "Known TOR Exit node participating in distributed credential stuffing attacks targeted at PSU online banking gateways.",
    activeMatches: 3
  },
  {
    id: "TIX-102",
    indicatorType: "DEVICE_FINGERPRINT",
    signatureValue: "D_F_3B8929A1009C72",
    reportedBy: "Canara Bank",
    reportedAt: "2026-06-18T05:00:00Z",
    riskWeight: 88,
    description: "Device signature tampering using specific Canvas spoofing library, targeting account creation workflows.",
    activeMatches: 1
  }
];

let systemMetrics: SystemMetrics = {
  totalUsers: 14820,
  totalBanks: 12,
  activeSessions: 529,
  fraudAlertsCount: 2,
  threatIntelligenceCount: 2
};

let aiModels: AIModelStatus[] = [
  {
    name: "Isolation Forest (Anomaly Detection)",
    type: "Unsupervised Anomaly Model",
    accuracy: 94.8,
    version: "v4.2.0-prod",
    lastRetrained: "3 days ago",
    status: "ACTIVE"
  },
  {
    name: "XGBoost Classifier (ATO Detector)",
    type: "Supervised Risk Classifier",
    accuracy: 98.2,
    version: "v8.1.1-prod",
    lastRetrained: "Yesterday",
    status: "ACTIVE"
  },
  {
    name: "Biometric Dynamic Estimator",
    type: "Keystroke & Mouse Behavioral Model",
    accuracy: 91.5,
    version: "v2.0.4-prod",
    lastRetrained: "5 days ago",
    status: "ACTIVE"
  }
];

let trustFormula: AdaptiveTrustFormula = {
  behaviorWeight: 30,
  deviceWeight: 30,
  transactionWeight: 20,
  contextWeight: 20
};

// Lazy initialization of Gemini Client
let geminiAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiAIClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
    try {
      geminiAIClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    } catch (e) {
      console.warn("Unable to initialize GoogleGenAI:", e);
    }
  }
  return geminiAIClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API - Role Management
  app.post("/api/auth/switch-role", (req, res) => {
    const { role } = req.body;
    if (role === "CUSTOMER" || role === "SECURITY_OFFICER" || role === "ADMIN") {
      activeRole = role;
      res.json({ success: true, role: activeRole });
    } else {
      res.status(400).json({ error: "Invalid role specified" });
    }
  });

  app.get("/api/auth/session", (req, res) => {
    res.json({
      user: {
        ...currentUser,
        role: activeRole
      }
    });
  });

  // API - Trust Score & Analytics
  app.get("/api/trust-score", (req, res) => {
    res.json({
      userId: currentUser.id,
      trustScore: currentUser.trustScore,
      status: currentUser.status,
      weights: trustFormula,
      breakdown: {
        behaviorScore: Math.round(96 * (trustFormula.behaviorWeight / 30)),
        deviceScore: Math.round(94 * (trustFormula.deviceWeight / 30)),
        transactionScore: Math.round(90 * (trustFormula.transactionWeight / 20)),
        contextScore: Math.round(88 * (trustFormula.contextWeight / 20))
      }
    });
  });

  // API - Devices
  app.get("/api/devices", (req, res) => {
    res.json(userDevices);
  });

  app.post("/api/devices/block", (req, res) => {
    const { deviceId } = req.body;
    const device = userDevices.find(d => d.id === deviceId);
    if (device) {
      device.status = "BLOCKED";
      device.trustScore = 0;
      res.json({ success: true, device });
    } else {
      res.status(444).json({ error: "Device not found" });
    }
  });

  app.post("/api/devices/approve", (req, res) => {
    const { deviceId } = req.body;
    const device = userDevices.find(d => d.id === deviceId);
    if (device) {
      device.status = "TRUSTED";
      device.trustScore = 95;
      res.json({ success: true, device });
    } else {
      res.status(444).json({ error: "Device not found" });
    }
  });

  // API - User Activity Log
  app.get("/api/user-activity", (req, res) => {
    res.json(userActivities);
  });

  // API - Fraud Alerts
  app.get("/api/fraud-alerts", (req, res) => {
    res.json(fraudAlerts);
  });

  app.post("/api/fraud-alerts/update-status", (req, res) => {
    const { alertId, status } = req.body;
    const alert = fraudAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = status;
      res.json({ success: true, alert });
    } else {
      res.status(444).json({ error: "Alert not found" });
    }
  });

  // API - Threat Intelligence Exchange (TIX)
  app.get("/api/threat-intelligence", (req, res) => {
    res.json(threatIntelligence);
  });

  app.post("/api/threat-intelligence/share", (req, res) => {
    const { indicatorType, signatureValue, riskWeight, description } = req.body;
    if (!signatureValue) {
      return res.status(400).json({ error: "Signature value required" });
    }
    const newThreat: ThreatSignature = {
      id: `TIX-${Math.floor(100 + Math.random() * 900)}`,
      indicatorType: indicatorType || "IP_ADDRESS",
      signatureValue,
      reportedBy: "State Bank of India (Our Node)",
      reportedAt: new Date().toISOString(),
      riskWeight: Number(riskWeight) || 75,
      description: description || "Manually shared threat signature context.",
      activeMatches: 0
    };
    threatIntelligence.unshift(newThreat);
    systemMetrics.threatIntelligenceCount = threatIntelligence.length;
    res.json({ success: true, threat: newThreat });
  });

  // API - Anomaly Detection status
  app.get("/api/anomaly-detection", (req, res) => {
    res.json(behaviorProfile);
  });

  // API - Admin Analytics & Models
  app.get("/api/admin/analytics", (req, res) => {
    res.json({
      metrics: systemMetrics,
      models: aiModels,
      formula: trustFormula
    });
  });

  app.post("/api/admin/update-formula", (req, res) => {
    const { behaviorWeight, deviceWeight, transactionWeight, contextWeight } = req.body;
    const total = Number(behaviorWeight) + Number(deviceWeight) + Number(transactionWeight) + Number(contextWeight);
    if (total !== 100) {
      return res.status(400).json({ error: "Total adaptive trust weights must sum exactly to 100%" });
    }
    trustFormula = {
      behaviorWeight: Number(behaviorWeight),
      deviceWeight: Number(deviceWeight),
      transactionWeight: Number(transactionWeight),
      contextWeight: Number(contextWeight)
    };
    res.json({ success: true, formula: trustFormula });
  });

  app.post("/api/admin/retrain-model", (req, res) => {
    const { modelName } = req.body;
    const model = aiModels.find(m => m.name === modelName);
    if (model) {
      model.status = "TRAINING";
      setTimeout(() => {
        model.status = "ACTIVE";
        model.accuracy = +(model.accuracy + (Math.random() * 0.4 - 0.1)).toFixed(2);
        model.lastRetrained = "Just now";
      }, 3000);
      res.json({ success: true, message: `Retraining initiated for ${modelName}` });
    } else {
      res.status(444).json({ error: "Model not found" });
    }
  });

  // API - Simulation Scenarios Execution Engine
  app.post("/api/scenarios/run", (req, res) => {
    const { scenarioId } = req.body;

    switch (scenarioId) {
      case "SCEN_01": // Legitimate Customer Access
        currentUser.trustScore = 92;
        currentUser.status = "TRUSTED";
        
        // Reset device details to trusted
        userDevices = [
          {
            id: "DEV-01",
            name: "SBI-Issued Workspace iMac",
            type: "DESKTOP",
            os: "macOS Ventura 13.5",
            ipAddress: "203.45.112.89",
            location: "Mumbai, IN",
            lastActive: "15 mins ago",
            trustScore: 98,
            status: "TRUSTED",
            isNew: false
          },
          {
            id: "DEV-02",
            name: "iPhone 15 Pro Max (SecureEnclave)",
            type: "MOBILE",
            os: "iOS 17.4",
            ipAddress: "49.36.81.214",
            location: "Mumbai, IN",
            lastActive: "Just now",
            trustScore: 95,
            status: "TRUSTED",
            isNew: false
          }
        ];

        behaviorProfile = {
          userId: "U-48291",
          loginTimePattern: "Expected: 09:00 - 18:00 (Office Hours)",
          deviceUsagePattern: "Primary: iOS & macOS. Trust Level 95%+",
          transactionPattern: "Low variance payroll & regular domestic utility bills",
          locationPattern: "Standard Region: Mumbai & Pune, IN",
          expectedLoginHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          currentLoginHour: 11,
          expectedLocation: "Mumbai, IN",
          currentLocation: "Mumbai, IN",
          anomalyScore: 0.02,
          explanation: "Perfect context alignment. Hardware biometrics matched, and timing adheres to normal commercial patterns."
        };

        userActivities.unshift({
          id: `ACT-${Date.now()}`,
          userId: "U-48291",
          userName: "Hari Narayanan",
          type: "LOGIN",
          timestamp: new Date().toISOString(),
          status: "SUCCESS",
          location: "Mumbai, IN",
          ipAddress: "49.36.81.214",
          device: "iPhone 15 Pro Max",
          details: "Standard access request matched behavior baseline.",
          riskScore: 2
        });
        break;

      case "SCEN_02": // New Device Login
        currentUser.trustScore = 65;
        currentUser.status = "SUSPICIOUS";

        // Append suspicious new device
        const exists = userDevices.some(d => d.id === "DEV-NEW");
        if (!exists) {
          userDevices.unshift({
            id: "DEV-NEW",
            name: "Windows 11 PC (Chrome 125)",
            type: "DESKTOP",
            os: "Windows 10 Pro",
            ipAddress: "14.139.45.168",
            location: "New Delhi, IN",
            lastActive: "Just now",
            trustScore: 45,
            status: "REQUIRES_MFA",
            isNew: true
          });
        }

        behaviorProfile = {
          userId: "U-48291",
          loginTimePattern: "Expected: 09:00 - 18:00 (Office Hours)",
          deviceUsagePattern: "Primary: iOS & macOS",
          transactionPattern: "Low variance payroll & utility",
          locationPattern: "Mumbai, IN",
          expectedLoginHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          currentLoginHour: 23, // 11 PM
          expectedLocation: "Mumbai, IN",
          currentLocation: "New Delhi, IN",
          anomalyScore: 0.62,
          explanation: "Medium Anomaly triggered. Device Fingerprint is completely new. Geographic displacement detected (Mumbai to New Delhi) inside 1 hour. Login hour is late night."
        };

        userActivities.unshift({
          id: `ACT-${Date.now()}`,
          userId: "U-48291",
          userName: "Hari Narayanan",
          type: "LOGIN",
          timestamp: new Date().toISOString(),
          status: "CHALLENGED",
          location: "New Delhi, IN",
          ipAddress: "14.139.45.168",
          device: "Windows 11 PC",
          details: "First-time device signature flagged. Real-time SMS & Hardware Token challenge issued.",
          riskScore: 35
        });
        break;

      case "SCEN_03": // Suspicious Account Recovery
        currentUser.trustScore = 25;
        currentUser.status = "SUSPICIOUS";

        behaviorProfile = {
          userId: "U-48291",
          loginTimePattern: "Expected: 09:00 - 18:00",
          deviceUsagePattern: "Primary: iOS & macOS",
          transactionPattern: "Standard regular items",
          locationPattern: "Mumbai, IN",
          expectedLoginHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          currentLoginHour: 3, // 3 AM
          expectedLocation: "Mumbai, IN",
          currentLocation: "Lagos, NG",
          anomalyScore: 0.94,
          explanation: "High Anomaly triggered! Immediate account recovery requested via unsupported browser on Android Emulator with VPN. Path geolocation indicates impossible travel speed."
        };

        // Inject Critical Fraud Alert
        const alertId = `AL-${Math.floor(9000 + Math.random() * 1000)}`;
        fraudAlerts.unshift({
          id: alertId,
          userId: "U-48291",
          userName: "Hari Narayanan",
          bankId: "B-SBI",
          bankName: "State Bank of India",
          title: "Account Takeover via Suspicious Recovery Attempt",
          severity: "CRITICAL",
          status: "ACTIVE",
          timestamp: new Date().toISOString(),
          description: "A sudden credential recovery form submitted from Lagos, Nigeria using proxy tunneling and spoofed browser fingerprint. Cross-signals indicates major fraud index.",
          signals: { behavior: 95, device: 88, transaction: 10, context: 99 }
        });

        userActivities.unshift({
          id: `ACT-${Date.now()}`,
          userId: "U-48291",
          userName: "Hari Narayanan",
          type: "RECOVERY",
          timestamp: new Date().toISOString(),
          status: "FAILED",
          location: "Lagos, NG",
          ipAddress: "102.89.23.12",
          device: "Android Emulator (Spoofed S23)",
          details: "Critical risk blocker active. Account recovery lock requested, forwarded to manual compliance board.",
          riskScore: 92
        });

        systemMetrics.fraudAlertsCount = fraudAlerts.length;
        break;

      case "SCEN_04": // Inter-Bank Threat Intelligence Sharing
        currentUser.trustScore = 10;
        currentUser.status = "BLOCKED";
        
        // Simulate adding shared threats to SBI and matching other compromised systems
        const matchedIP = "109.202.107.15";
        
        const sharedThreat: ThreatSignature = {
          id: `TIX-${Math.floor(100 + Math.random() * 900)}`,
          indicatorType: "IP_ADDRESS",
          signatureValue: matchedIP,
          reportedBy: "Punjab National Bank",
          reportedAt: new Date().toISOString(),
          riskWeight: 92,
          description: "Compromised regional VPN IP node participating in rapid-fire automated OTP bypass scripts.",
          activeMatches: 4
        };

        threatIntelligence.unshift(sharedThreat);
        systemMetrics.threatIntelligenceCount = threatIntelligence.length;

        // Immediately link to activity trace
        userActivities.unshift({
          id: `ACT-${Date.now()}`,
          userId: "U-48291",
          userName: "Hari Narayanan",
          type: "LOGIN",
          timestamp: new Date().toISOString(),
          status: "FAILED",
          location: "Prague, CZ",
          ipAddress: matchedIP,
          device: "Tor Browser",
          details: "Access automatically terminated: IP address matched threat feed from PNB Trust Exchange Network.",
          riskScore: 98
        });
        break;

      default:
        res.status(400).json({ error: "Unknown scenario" });
        return;
    }

    res.json({
      success: true,
      currentUser,
      userDevices,
      behaviorProfile,
      alertsCount: fraudAlerts.length,
      threatCount: threatIntelligence.length
    });
  });

  // API - Explainable AI (Gemini Core SDK Server-Side Proxy Endpoint)
  // Evaluates standard JSON risk profile and generates explainable cybersecurity writeup
  app.post("/api/explain-risk", async (req, res) => {
    const { score, status, behaviorScore, deviceScore, transactionScore, contextScore, explanationText } = req.body;
    
    // Fallback static prompt response if API Key is not configured
    const client = getGeminiClient();
    if (!client) {
      // High quality procedural generator
      const summary = `### TRUSTNETRA AI Cybersecurity Audit Summary

This cybersecurity profile exhibits a trust validation index of **${score}/100**, yielding a safety diagnosis of **${status}**. 

#### Adaptive Risk Analysis:
1. **Behavior Profiling (${behaviorScore}/100)**: ${behaviorScore < 80 ? "Behavior patterns are anomalous, flagging out-of-character transaction times or excessive entropy." : "The behavior adheres carefully to historical user biometric templates."}
2. **Device Hardware Fingerprint (${deviceScore}/100)**: ${deviceScore < 80 ? "The connected machine exhibits spoofed canvas headers or a newly registered device profile." : "Approved security keys and matched cryptographical tokens are intact."}
3. **Transaction Context (${transactionScore}/100 & ${contextScore}/100)**: ${contextScore < 80 ? "High risk travel thresholds violated, highlighting geo-impossible velocity limits." : "Geography and system coordinates align with traditional commercial locations."}

#### Anomaly Engine Log:
*"${explanationText || "Metrics within safe parameters. Continuity verified."}"*

**Defense Recommendation**: ${score < 50 ? "IMMEDIATE AUDIT MANDATORY: Revoke active cookies, prompt FIDO2 hardware triggers, and initiate security desk review." : score < 80 ? "AUTHENTICATION CHALLENGE REQUIRED: Issue real-time SMS OTP or voice challenge verification." : "COMPLIANT PASS: Bypass friction queues to streamline transaction routing."}`;
      
      return res.json({ response: summary, source: "procedural" });
    }

    try {
      const prompt = `You are the core core-brains AI security officer of TRUSTNETRA. 
      Analyze this customer's active security session and output a highly technical, professional, 
      explainable AI report. Include specific compliance suggestions for Public Sector Banks (e.g., FIDO2 keys, MFA step-ups, or manual block routing).
      
      SESSION METRICS:
      - overall Trust Score: ${score}/100
      - Safety Classification: ${status}
      - Behavioral Trust Score: ${behaviorScore}/100
      - Device Fingerprint Trust: ${deviceScore}/100
      - Financial Transaction deviation: ${transactionScore}/100
      - Contextual Geolocation Risk: ${contextScore}/100
      - Raw anomaly engine explanation: "${explanationText}"

      FORMATTING:
      - Organize your report in clear sections with markdown headers.
      - Maintain a serious, executive cybersecurity analyst tone.
      - Be direct and do not praise the interface or include generic pleasantries. Output strictly the cybersecurity analysis.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the head adaptive security analyst for TRUSTNETRA, a cybersecurity identity fabric for banks. Your analysis guides compliance actions under RBI and banking regulations."
        }
      });
      
      res.json({ response: response.text, source: "gemini" });
    } catch (err: any) {
      console.error("Gemini risk audit call failed:", err);
      res.status(500).json({ error: "Cybersecurity audit engine error", details: err?.message });
    }
  });

  // Handle Vite Asset Serving & Development Routing
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[TRUSTNETRA Server] Active and listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start TRUSTNETRA platform server:", err);
});
