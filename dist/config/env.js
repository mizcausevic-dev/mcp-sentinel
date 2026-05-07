"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    logLevel: process.env.LOG_LEVEL ?? 'info',
    healthPollInterval: parseInt(process.env.HEALTH_POLL_INTERVAL ?? '30', 10),
    schemaPollInterval: parseInt(process.env.SCHEMA_POLL_INTERVAL ?? '300', 10),
    injectionRiskThreshold: parseFloat(process.env.INJECTION_RISK_THRESHOLD ?? '0.65'),
    driftAlertThreshold: parseFloat(process.env.DRIFT_ALERT_THRESHOLD ?? '0.20'),
    alertWebhookUrl: process.env.ALERT_WEBHOOK_URL ?? '',
};
//# sourceMappingURL=env.js.map