import { z } from 'zod';
export declare const ServerRegistrationSchema: z.ZodObject<{
    name: z.ZodString;
    endpoint: z.ZodString;
    transport: z.ZodEnum<["stdio", "sse", "http", "streamable-http"]>;
    authMethod: z.ZodEnum<["none", "bearer", "oauth2", "mtls", "api-key"]>;
    oauthScopes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    declaredTools: z.ZodArray<z.ZodString, "many">;
    owner: z.ZodString;
    environment: z.ZodEnum<["production", "staging", "development"]>;
}, "strip", z.ZodTypeAny, {
    environment: "development" | "production" | "staging";
    name: string;
    endpoint: string;
    transport: "stdio" | "sse" | "http" | "streamable-http";
    authMethod: "none" | "bearer" | "oauth2" | "mtls" | "api-key";
    oauthScopes: string[];
    declaredTools: string[];
    owner: string;
}, {
    environment: "development" | "production" | "staging";
    name: string;
    endpoint: string;
    transport: "stdio" | "sse" | "http" | "streamable-http";
    authMethod: "none" | "bearer" | "oauth2" | "mtls" | "api-key";
    declaredTools: string[];
    owner: string;
    oauthScopes?: string[] | undefined;
}>;
export declare const ToolSchemaSchema: z.ZodObject<{
    serverId: z.ZodString;
    toolName: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    inputSchema: z.ZodRecord<z.ZodString, z.ZodAny>;
    destructive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    requiresApproval: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    serverId: string;
    toolName: string;
    description: string;
    inputSchema: Record<string, any>;
    destructive: boolean;
    requiresApproval: boolean;
}, {
    serverId: string;
    toolName: string;
    inputSchema: Record<string, any>;
    description?: string | undefined;
    destructive?: boolean | undefined;
    requiresApproval?: boolean | undefined;
}>;
export declare const InvocationSchema: z.ZodObject<{
    serverId: z.ZodString;
    toolName: z.ZodString;
    caller: z.ZodString;
    arguments: z.ZodRecord<z.ZodString, z.ZodAny>;
    resultPreview: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    latencyMs: z.ZodNumber;
    status: z.ZodEnum<["ok", "error", "timeout", "denied"]>;
    promptContext: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: "error" | "ok" | "timeout" | "denied";
    serverId: string;
    toolName: string;
    caller: string;
    arguments: Record<string, any>;
    resultPreview: string;
    latencyMs: number;
    promptContext: string;
}, {
    status: "error" | "ok" | "timeout" | "denied";
    serverId: string;
    toolName: string;
    caller: string;
    arguments: Record<string, any>;
    latencyMs: number;
    resultPreview?: string | undefined;
    promptContext?: string | undefined;
}>;
export declare const SecurityScanSchema: z.ZodObject<{
    serverId: z.ZodString;
    includeNetwork: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeAuth: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeToolSurface: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    serverId: string;
    includeNetwork: boolean;
    includeAuth: boolean;
    includeToolSurface: boolean;
}, {
    serverId: string;
    includeNetwork?: boolean | undefined;
    includeAuth?: boolean | undefined;
    includeToolSurface?: boolean | undefined;
}>;
export type ServerRegistration = z.infer<typeof ServerRegistrationSchema>;
export type ToolSchemaPayload = z.infer<typeof ToolSchemaSchema>;
export type InvocationPayload = z.infer<typeof InvocationSchema>;
export type SecurityScanPayload = z.infer<typeof SecurityScanSchema>;
