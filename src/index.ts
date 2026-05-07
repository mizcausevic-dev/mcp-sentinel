import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { serversRouter } from './routes/servers.js';
import {
  auditsRouter,
  incidentsRouter,
  policiesRouter,
  dashboardRouter,
} from './routes/audits.js';
import { validateRouter, securityScanRouter, postureCheckRouter } from './routes/validate.js';
import { openApiSpec } from './docs/swagger.js';

export const app = express();
const startedAt = Date.now();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'mcp-sentinel',
    version: '0.1.0',
    uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    nodeEnv: env.nodeEnv,
  });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use('/api/servers', serversRouter);
app.use('/api/audits', auditsRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/validate', validateRouter);
app.use('/api/security-scan', securityScanRouter);
app.use('/api/posture-check', postureCheckRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'not-found' });
});

if (require.main === module) {
  app.listen(env.port, () => {
    console.log(`[mcp-sentinel] listening on http://localhost:${env.port}`);
    console.log(`[mcp-sentinel] swagger docs at http://localhost:${env.port}/docs`);
  });
}
