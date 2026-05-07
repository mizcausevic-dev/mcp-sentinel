import { Router } from 'express';
import { servers, findServer } from '../data/servers';

export const serversRouter = Router();

serversRouter.get('/', (_req, res) => {
  res.json({
    count: servers.length,
    servers: servers.map((s) => ({
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

serversRouter.get('/:id', (req, res) => {
  const server = findServer(req.params.id);
  if (!server) {
    return res.status(404).json({ error: 'server-not-found', serverId: req.params.id });
  }
  return res.json(server);
});

serversRouter.get('/:id/tools', (req, res) => {
  const server = findServer(req.params.id);
  if (!server) {
    return res.status(404).json({ error: 'server-not-found', serverId: req.params.id });
  }
  return res.json({
    serverId: server.id,
    declaredTools: server.declaredTools,
  });
});
