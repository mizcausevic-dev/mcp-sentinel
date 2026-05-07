"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = exports.policiesRouter = exports.incidentsRouter = exports.auditsRouter = void 0;
const express_1 = require("express");
const audits_1 = require("../data/audits");
const servers_1 = require("../data/servers");
exports.auditsRouter = (0, express_1.Router)();
exports.auditsRouter.get('/', (_req, res) => {
    res.json({ count: audits_1.audits.length, audits: audits_1.audits });
});
exports.incidentsRouter = (0, express_1.Router)();
exports.incidentsRouter.get('/', (_req, res) => {
    res.json({ count: audits_1.incidents.length, incidents: audits_1.incidents });
});
exports.policiesRouter = (0, express_1.Router)();
exports.policiesRouter.get('/', (_req, res) => {
    res.json({ count: audits_1.policies.length, policies: audits_1.policies });
});
exports.dashboardRouter = (0, express_1.Router)();
exports.dashboardRouter.get('/summary', (_req, res) => {
    const total = servers_1.servers.length;
    const healthy = servers_1.servers.filter((s) => s.status === 'healthy').length;
    const degraded = servers_1.servers.filter((s) => s.status === 'degraded').length;
    const down = servers_1.servers.filter((s) => s.status === 'down').length;
    const quarantined = servers_1.servers.filter((s) => s.status === 'quarantined').length;
    const avgPosture = Math.round(servers_1.servers.reduce((acc, s) => acc + s.postureScore, 0) / Math.max(1, total));
    const openIncidents = audits_1.incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length;
    const blocked = audits_1.audits.filter((a) => a.decision === 'blocked').length;
    res.json({
        fleet: { total, healthy, degraded, down, quarantined, avgPostureScore: avgPosture },
        incidents: {
            total: audits_1.incidents.length,
            open: openIncidents,
            bySeverity: {
                critical: audits_1.incidents.filter((i) => i.severity === 'critical').length,
                high: audits_1.incidents.filter((i) => i.severity === 'high').length,
                medium: audits_1.incidents.filter((i) => i.severity === 'medium').length,
                low: audits_1.incidents.filter((i) => i.severity === 'low').length,
            },
        },
        audits: {
            total: audits_1.audits.length,
            blocked,
            flagged: audits_1.audits.filter((a) => a.decision === 'flagged').length,
            allowed: audits_1.audits.filter((a) => a.decision === 'allowed').length,
        },
        policies: { active: audits_1.policies.length },
        generatedAt: new Date().toISOString(),
    });
});
//# sourceMappingURL=audits.js.map