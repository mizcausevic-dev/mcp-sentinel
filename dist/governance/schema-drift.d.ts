import type { ToolSchemaPayload } from '../schemas/validation-schemas';
export interface SchemaDriftResult {
    status: 'allowed' | 'flagged' | 'blocked';
    drift: number;
    added: string[];
    removed: string[];
    signatureChanged: boolean;
    issues: string[];
    passedChecks: string[];
    recommendedNextAction: string;
}
export declare function evaluateToolSchema(payload: ToolSchemaPayload): SchemaDriftResult;
