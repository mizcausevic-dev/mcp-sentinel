import type { ToolSchemaPayload } from '../schemas/validation-schemas';

interface ToolSnapshot {
  serverId: string;
  toolName: string;
  parameterNames: string[];
  destructive: boolean;
  requiresApproval: boolean;
  hashedShape: string;
  capturedAt: string;
}

const snapshots = new Map<string, ToolSnapshot>();

function shapeHash(inputSchema: Record<string, unknown>): string {
  const keys = Object.keys(inputSchema).sort();
  return keys.map((k) => `${k}:${typeof (inputSchema as any)[k]}`).join('|');
}

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

export function evaluateToolSchema(payload: ToolSchemaPayload): SchemaDriftResult {
  const key = `${payload.serverId}::${payload.toolName}`;
  const previous = snapshots.get(key);
  const parameterNames = Object.keys(payload.inputSchema).sort();
  const hashedShape = shapeHash(payload.inputSchema);

  const issues: string[] = [];
  const passed: string[] = [];
  let added: string[] = [];
  let removed: string[] = [];
  let signatureChanged = false;
  let drift = 0;

  if (!previous) {
    snapshots.set(key, {
      serverId: payload.serverId,
      toolName: payload.toolName,
      parameterNames,
      destructive: payload.destructive,
      requiresApproval: payload.requiresApproval,
      hashedShape,
      capturedAt: new Date().toISOString(),
    });
    passed.push('First snapshot captured for this tool; baseline established.');
    return {
      status: 'allowed',
      drift: 0,
      added: [],
      removed: [],
      signatureChanged: false,
      issues,
      passedChecks: passed,
      recommendedNextAction: 'Baseline stored. Continuous schema polling is now active.',
    };
  }

  added = parameterNames.filter((p) => !previous.parameterNames.includes(p));
  removed = previous.parameterNames.filter((p) => !parameterNames.includes(p));
  signatureChanged = previous.hashedShape !== hashedShape;
  const totalChange = added.length + removed.length;
  const baseSize = Math.max(1, previous.parameterNames.length);
  drift = totalChange / baseSize;

  if (added.length > 0) {
    issues.push(`New parameters added without approval: ${added.join(', ')}.`);
  }
  if (removed.length > 0) {
    issues.push(`Parameters removed (potential client breakage): ${removed.join(', ')}.`);
  }
  if (
    payload.destructive !== previous.destructive ||
    payload.requiresApproval !== previous.requiresApproval
  ) {
    issues.push('Tool risk flags (destructive or requiresApproval) changed since last snapshot.');
  }
  if (signatureChanged && totalChange === 0) {
    issues.push('Parameter type signature changed; client contract may be silently broken.');
  }
  if (totalChange === 0 && !signatureChanged) {
    passed.push('No parameter additions, removals, or signature changes since last snapshot.');
  }

  let status: 'allowed' | 'flagged' | 'blocked';
  let recommendedNextAction: string;

  if (drift === 0 && !signatureChanged) {
    status = 'allowed';
    recommendedNextAction = 'No drift; continue routine polling.';
  } else if (drift < 0.4 && payload.requiresApproval) {
    status = 'flagged';
    recommendedNextAction = 'Open approval ticket for schema change before next promotion.';
  } else {
    status = 'blocked';
    recommendedNextAction = 'Block tool from agent traffic until approval workflow completes.';
  }

  // Refresh snapshot after evaluation
  snapshots.set(key, {
    serverId: payload.serverId,
    toolName: payload.toolName,
    parameterNames,
    destructive: payload.destructive,
    requiresApproval: payload.requiresApproval,
    hashedShape,
    capturedAt: new Date().toISOString(),
  });

  return {
    status,
    drift: Math.round(drift * 100) / 100,
    added,
    removed,
    signatureChanged,
    issues,
    passedChecks: passed,
    recommendedNextAction,
  };
}
