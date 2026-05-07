import type { SecurityScanPayload } from '../schemas/validation-schemas';
export interface SecurityScanResult {
    serverId: string;
    status: 'pass' | 'review' | 'fail';
    postureScore: number;
    failedPolicies: string[];
    passedPolicies: string[];
    issues: string[];
    recommendedNextAction: string;
}
export declare function runSecurityScan(payload: SecurityScanPayload): SecurityScanResult;
