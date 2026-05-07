"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serversRouter = void 0;
const express_1 = require("express");
const servers_1 = require("../data/servers");
exports.serversRouter = (0, express_1.Router)();
exports.serversRouter.get('/', (_req, res) => {
    res.json({
        count: servers_1.servers.length,
        servers: servers_1.servers.map((s) => ({
            id: s.id,
            name: s.name,
            environment: s.environment,
            status: s.status,
            transport: s.transport,
            authMethod: s.authMethod,
            postureScore: s.postureScore,
            lastSeenAt: s.lastSeenAt,
        })),
    });
});
exports.serversRouter.get('/:id', (req, res) => {
    const server = (0, servers_1.findServer)(req.params.id);
    if (!server) {
        return res.status(404).json({ error: 'server-not-found', serverId: req.params.id });
    }
    return res.json(server);
});
exports.serversRouter.get('/:id/tools', (req, res) => {
    const server = (0, servers_1.findServer)(req.params.id);
    if (!server) {
        return res.status(404).json({ error: 'server-not-found', serverId: req.params.id });
    }
    return res.json({
        serverId: server.id,
        declaredTools: server.declaredTools,
    });
});
//# sourceMappingURL=servers.js.map