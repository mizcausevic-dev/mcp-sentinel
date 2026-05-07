"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiSpec = void 0;
exports.openApiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'MCP Sentinel API',
        version: '0.1.0',
        description: 'Observability, security audit, and governance layer for Model Context Protocol (MCP) servers.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local dev' }],
    paths: {
        '/health': { get: { summary: 'Service health', responses: { '200': { description: 'OK' } } } },
        '/api/servers': { get: { summary: 'List registered MCP servers' } },
        '/api/servers/{id}': {
            get: {
                summary: 'Fetch one MCP server',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            },
        },
        '/api/servers/{id}/tools': {
            get: {
                summary: 'List declared tools for a server',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            },
        },
        '/api/audits': { get: { summary: 'Audit history' } },
        '/api/incidents': { get: { summary: 'Open and historical incidents' } },
        '/api/policies': { get: { summary: 'Active governance policies' } },
        '/api/dashboard/summary': { get: { summary: 'Operations dashboard summary' } },
        '/api/validate/server': {
            post: { summary: 'Validate a server registration payload' },
        },
        '/api/validate/schema': {
            post: { summary: 'Validate a tool schema for drift and risk' },
        },
        '/api/validate/invocation': {
            post: { summary: 'Validate an inflight tool invocation for prompt injection and PII risk' },
        },
        '/api/security-scan': {
            post: { summary: 'Run combined security posture scan on a registered server' },
        },
        '/api/posture-check': {
            post: { summary: 'Run combined production-readiness posture check on a server payload' },
        },
    },
};
//# sourceMappingURL=swagger.js.map