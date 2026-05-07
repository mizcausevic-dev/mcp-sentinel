"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityScanSchema = exports.InvocationSchema = exports.ToolSchemaSchema = exports.ServerRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.ServerRegistrationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(64),
    endpoint: zod_1.z.string().url(),
    transport: zod_1.z.enum(['stdio', 'sse', 'http', 'streamable-http']),
    authMethod: zod_1.z.enum(['none', 'bearer', 'oauth2', 'mtls', 'api-key']),
    oauthScopes: zod_1.z.array(zod_1.z.string()).optional().default([]),
    declaredTools: zod_1.z.array(zod_1.z.string()).min(0),
    owner: zod_1.z.string().min(1),
    environment: zod_1.z.enum(['production', 'staging', 'development']),
});
exports.ToolSchemaSchema = zod_1.z.object({
    serverId: zod_1.z.string().min(1),
    toolName: zod_1.z.string().min(1),
    description: zod_1.z.string().optional().default(''),
    inputSchema: zod_1.z.record(zod_1.z.any()),
    destructive: zod_1.z.boolean().optional().default(false),
    requiresApproval: zod_1.z.boolean().optional().default(false),
});
exports.InvocationSchema = zod_1.z.object({
    serverId: zod_1.z.string().min(1),
    toolName: zod_1.z.string().min(1),
    caller: zod_1.z.string().min(1),
    arguments: zod_1.z.record(zod_1.z.any()),
    resultPreview: zod_1.z.string().max(8000).optional().default(''),
    latencyMs: zod_1.z.number().min(0),
    status: zod_1.z.enum(['ok', 'error', 'timeout', 'denied']),
    promptContext: zod_1.z.string().max(8000).optional().default(''),
});
exports.SecurityScanSchema = zod_1.z.object({
    serverId: zod_1.z.string().min(1),
    includeNetwork: zod_1.z.boolean().optional().default(true),
    includeAuth: zod_1.z.boolean().optional().default(true),
    includeToolSurface: zod_1.z.boolean().optional().default(true),
});
//# sourceMappingURL=validation-schemas.js.map