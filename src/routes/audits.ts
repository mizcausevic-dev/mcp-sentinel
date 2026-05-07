import { Router } from 'express';
import { audits, incidents, policies } from '../data/audits';
import { servers } from '../data/servers';

export const auditsRouter = Router();
auditsRouter.get('/', (_req, res) => {
  res.json({ count: audits.length, audits });
});

export const incidentsRouter = Router();
incidentsRouter.get('/', (_req, res) => {
  res.json({ count: incidents.length, incidents });
});

export const policiesRouter = Router();
policiesRouter.get('/', (_req, res) => {
  res.json({ count: policies.length, policies });
});

export const dashboardRouter = Router();
dashboardRouter.get('/summary', (_req, res) => {
  const total = servers.length;
  const healthy = servers.filter((s) => s.status === 'healthy').length;
  const degraded = servers.filter((s) => s.status === 'degraded').length;
  const down = servers.filter((s) => s.status === 'down').length;
  const quarantined = servers.filter((s) => s.status === 'quarantined').length;
  const avgPosture = Math.round(
    servers.reduce((acc, s) => acc + s.postureScore, 0) / Math.max(1, total)
  );
  const openIncidents = incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length;
  const blocked = audits.filter((a) => a.decision === 'blocked').length;

  res.json({
    fleet: { total, healthy, degraded, down, quarantined, avgPostureScore: avgPosture },
    incidents: {
      total: incidents.length,
      open: openIncidents,
      bySeverity: {
        critical: incidents.filter((i) => i.severity === 'critical').length,
        high: incidents.filter((i) => i.severity === 'high').length,
        medium: incidents.filter((i) => i.severity === 'medium').length,
        low: incidents.filter((i) => i.severity === 'low').length,
      },
    },
    audits: {
      total: audits.length,
      blocked,
      flagged: audits.filter((a) => a.decision === 'flagged').length,
      allowed: audits.filter((a) => a.decision === 'allowed').length,
    },
    policies: { active: policies.length },
    generatedAt: new Date().toISOString(),
  });
});
