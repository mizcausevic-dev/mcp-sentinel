import type { InvocationPayload } from '../schemas/validation-schemas';
export interface InvocationVerdict {
    status: 'allowed' | 'flagged' | 'blocked';
    riskScore: number;
    matchedSignatures: string[];
    piiMatches: string[];
    issues: string[];
    passedChecks: string[];
    recommendedNextAction: string;
}
export declare function evaluateInvocation(payload: InvocationPayload): InvocationVerdict;
