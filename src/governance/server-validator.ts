import type { ServerRegistration } from '../schemas/validation-schemas';

export interface ValidationResult {
  status: 'allowed' | 'flagged' | 'blocked';
  postureScore: number;
  issues: string[];
  passedChecks: string[];
  recommendedNextAction: string;
}

const DESTRUCTIVE_TOKENS = ['delete', 'drop', 'remove', 'truncate', 'wipe', 'force', 'exec'];
const WRITE_TOKENS = ['write', 'create', 'update', 'merge', 'send', 'post', 'patch'];

export function validateServerRegistration(payload: ServerRegistration): ValidationResult {
  const issues: string[] = [];
  const passed: string[] = [];
  let score = 100;

  // Auth posture
  if (payload.authMethod === 'none' && payload.environment === 'production') {
    issues.push('Production server registered with authMethod=none.');
    score -= 35;
  } else if (payload.authMethod === 'none') {
    issues.push('Server has no authentication; safe only for isolated sandboxes.');
    score -= 15;
  } else {
    passed.push(`Authentication method ${payload.authMethod} is acceptable for ${payload.environment}.`);
  }

  // OAuth scope hygiene
  const writeOrAdminScopes = payload.oauthScopes.filter((s) =>
    /(^|:)(write|admin)/i.test(s) || /\b(write|admin)/i.test(s)
  );
  if (writeOrAdminScopes.length > 0) {
    issues.push(
      `OAuth scopes include write/admin grants: ${writeOrAdminScopes.join(', ')}. Verify least-privilege.`
    );
    score -= 10;
  } else if (payload.authMethod === 'oauth2') {
    passed.push('OAuth scopes appear least-privilege.');
  }

  // Tool surface vs auth pairing
  const destructiveTools = payload.declaredTools.filter((t) =>
    DESTRUCTIVE_TOKENS.some((token) => t.toLowerCase().includes(token))
  );
  const writeTools = payload.declaredTools.filter((t) =>
    WRITE_TOKENS.some((token) => t.toLowerCase().includes(token))
  );

  if (destructiveTools.length > 0 && payload.authMethod === 'none') {
    issues.push(
      `Destructive tools (${destructiveTools.join(', ')}) exposed without authentication.`
    );
    score -= 30;
  } else if (destructiveTools.length > 0) {
    passed.push(`Destructive tools present (${destructiveTools.join(', ')}) but auth is enforced.`);
  }

  if (writeTools.length > 0 && payload.authMethod === 'none' && payload.environment === 'production') {
    issues.push('Write-capable tools exposed in production without authentication.');
    score -= 20;
  }

  // Transport posture
  if (payload.transport === 'stdio' && payload.environment === 'production') {
    issues.push('stdio transport in production; remote-attach risk if container is compromised.');
    score -= 10;
  } else if (payload.transport === 'http' && !payload.endpoint.startsWith('https://')) {
    issues.push('HTTP transport without TLS in endpoint URL.');
    score -= 25;
  } else if (
    payload.transport === 'streamable-http' ||
    payload.transport === 'sse' ||
    payload.transport === 'http'
  ) {
    if (payload.endpoint.startsWith('https://')) {
      passed.push('Endpoint enforces HTTPS.');
    }
  }

  // Owner/governance
  if (!payload.owner || payload.owner.length < 2) {
    issues.push('No accountable owner declared; governance accountability gap.');
    score -= 5;
  } else {
    passed.push(`Accountable owner declared: ${payload.owner}.`);
  }

  score = Math.max(0, Math.min(100, score));

  let status: 'allowed' | 'flagged' | 'blocked';
  let recommendedNextAction: string;

  if (score >= 80) {
    status = 'allowed';
    recommendedNextAction = 'Approve registration and enable continuous polling.';
  } else if (score >= 55) {
    status = 'flagged';
    recommendedNextAction = 'Route to platform security review before granting production traffic.';
  } else {
    status = 'blocked';
    recommendedNextAction = 'Block registration until destructive surface or auth posture is remediated.';
  }

  return { status, postureScore: score, issues, passedChecks: passed, recommendedNextAction };
}
