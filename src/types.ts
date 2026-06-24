/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "CUSTOMER" | "SECURITY_OFFICER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bankId: string;
  bankName: string;
  trustScore: number;
  status: "TRUSTED" | "SUSPICIOUS" | "BLOCKED";
}

export interface Bank {
  id: string;
  name: string;
  location: string;
  tier: string;
  activeUsers: number;
  fraudAlertsCount: number;
}

export interface Device {
  id: string;
  name: string;
  type: "MOBILE" | "DESKTOP" | "TABLET" | "UNKNOWN";
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  trustScore: number;
  status: "TRUSTED" | "REQUIRES_MFA" | "SUSPICIOUS" | "BLOCKED";
  isNew: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  type: "LOGIN" | "TRANSACTION" | "RECOVERY" | "MFA_VERIFIED" | "PASSWORD_CHANGE" | "CREDENTIAL_UPDATE";
  timestamp: string;
  status: "SUCCESS" | "FAILED" | "CHALLENGED";
  location: string;
  ipAddress: string;
  device: string;
  details: string;
  riskScore: number; // 0 (none) to 100 (critical)
}

export interface BehaviorProfile {
  userId: string;
  loginTimePattern: string; // "Expected: 09:00 - 18:00 (Office Hours)"
  deviceUsagePattern: string; // "Primary: macOS. Secondary: iOS"
  transactionPattern: string; // "Recurring payroll, low deviation utility transactions"
  locationPattern: string; // "Regularly Mumbai, IN"
  expectedLoginHours: number[]; // hour values, e.g. [9,10,11,12,13,14,15,16,17,18]
  currentLoginHour: number;
  expectedLocation: string;
  currentLocation: string;
  anomalyScore: number; // 0 to 1
  explanation: string;
}

export interface FraudAlert {
  id: string;
  userId: string;
  userName: string;
  bankId: string;
  bankName: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "ACTIVE" | "UNDER_REVIEW" | "RESOLVED" | "BLOCKED";
  timestamp: string;
  description: string;
  signals: {
    behavior: number;
    device: number;
    transaction: number;
    context: number;
  };
}

export interface ThreatSignature {
  id: string;
  indicatorType: "IP_ADDRESS" | "DEVICE_FINGERPRINT" | "BEHAVIORAL_ANOMALY" | "MALICIOUS_RECOVERY";
  signatureValue: string;
  reportedBy: string; // "State Bank of India", etc.
  reportedAt: string;
  riskWeight: number;
  description: string;
  activeMatches: number;
}

export interface SystemMetrics {
  totalUsers: number;
  totalBanks: number;
  activeSessions: number;
  fraudAlertsCount: number;
  threatIntelligenceCount: number;
}

export interface AIModelStatus {
  name: string;
  type: string;
  accuracy: number;
  version: string;
  lastRetrained: string;
  status: "ACTIVE" | "REINITIALIZING" | "TRAINING";
}

export interface AdaptiveTrustFormula {
  behaviorWeight: number;
  deviceWeight: number;
  transactionWeight: number;
  contextWeight: number;
}
