export interface McpServer {
    id: string;
    name: string;
    endpoint: string;
    transport: 'stdio' | 'sse' | 'http' | 'streamable-http';
    authMethod: 'none' | 'bearer' | 'oauth2' | 'mtls' | 'api-key';
    oauthScopes: string[];
    declaredTools: string[];
    owner: string;
    environment: 'production' | 'staging' | 'development';
    postureScore: number;
    status: 'healthy' | 'degraded' | 'down' | 'quarantined';
    lastSeenAt: string;
    registeredAt: string;
}
export declare const servers: McpServer[];
export declare function findServer(id: string): McpServer | undefined;
