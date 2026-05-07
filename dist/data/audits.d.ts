export interface AuditRecord {
    id: string;
    serverId: string;
    type: 'registration' | 'invocation' | 'schema-change' | 'security-scan' | 'policy-check';
    decision: 'allowed' | 'flagged' | 'blocked';
    score: number;
    summary: string;
    createdAt: string;
}
export declare const audits: AuditRecord[];
export interface Incident {
    id: string;
    serverId: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    detector: string;
    status: 'open' | 'investigating' | 'mitigated' | 'closed';
    openedAt: string;
}
export declare const incidents: Incident[];
export interface Policy {
    id: string;
    name: string;
    scope: 'global' | 'environment' | 'server';
    rule: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    enforcement: 'warn' | 'flag' | 'block';
}
export declare const policies: Policy[];
