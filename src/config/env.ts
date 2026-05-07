import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  healthPollInterval: parseInt(process.env.HEALTH_POLL_INTERVAL ?? '30', 10),
  schemaPollInterval: parseInt(process.env.SCHEMA_POLL_INTERVAL ?? '300', 10),
  injectionRiskThreshold: parseFloat(process.env.INJECTION_RISK_THRESHOLD ?? '0.65'),
  driftAlertThreshold: parseFloat(process.env.DRIFT_ALERT_THRESHOLD ?? '0.20'),
  alertWebhookUrl: process.env.ALERT_WEBHOOK_URL ?? '',
};
