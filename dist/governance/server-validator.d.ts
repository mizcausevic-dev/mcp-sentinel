import type { ServerRegistration } from '../schemas/validation-schemas';
export interface ValidationResult {
    status: 'allowed' | 'flagged' | 'blocked';
    postureScore: number;
    issues: string[];
    passedChecks: string[];
    recommendedNextAction: string;
}
export declare function validateServerRegistration(payload: ServerRegistration): ValidationResult;
