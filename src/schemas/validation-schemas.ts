import { z } from 'zod';

export const ServerRegistrationSchema = z.object({
  name: z.string().min(2).max(64),
  endpoint: z.string().url(),
  transport: z.enum(['stdio', 'sse', 'http', 'streamable-http']),
  authMethod: z.enum(['none', 'bearer', 'oauth2', 'mtls', 'api-key']),
  oauthScopes: z.array(z.string()).optional().default([]),
  declaredTools: z.array(z.string()).min(0),
  owner: z.string().min(1),
  environment: z.enum(['production', 'staging', 'development']),
});

export const ToolSchemaSchema = z.object({
  serverId: z.string().min(1),
  toolName: z.string().min(1),
  description: z.string().optional().default(''),
  inputSchema: z.record(z.any()),
  destructive: z.boolean().optional().default(false),
  requiresApproval: z.boolean().optional().default(false),
});

export const InvocationSchema = z.object({
  serverId: z.string().min(1),
  toolName: z.string().min(1),
  caller: z.string().min(1),
  arguments: z.record(z.any()),
  resultPreview: z.string().max(8000).optional().default(''),
  latencyMs: z.number().min(0),
  status: z.enum(['ok', 'error', 'timeout', 'denied']),
  promptContext: z.string().max(8000).optional().default(''),
});

export const SecurityScanSchema = z.object({
  serverId: z.string().min(1),
  includeNetwork: z.boolean().optional().default(true),
  includeAuth: z.boolean().optional().default(true),
  includeToolSurface: z.boolean().optional().default(true),
});

export type ServerRegistration = z.infer<typeof ServerRegistrationSchema>;
export type ToolSchemaPayload = z.infer<typeof ToolSchemaSchema>;
export type InvocationPayload = z.infer<typeof InvocationSchema>;
export type SecurityScanPayload = z.infer<typeof SecurityScanSchema>;
