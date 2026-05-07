import { findServer } from '../data/servers';
import { policies } from '../data/audits';
import { validateServerRegistration } from './server-validator';
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

export function runSecurityScan(payload: SecurityScanPayload): SecurityScanResult {
  const server = findServer(payload.serverId);

  if (!server) {
    return {
      serverId: payload.serverId,
      status: 'fail',
      postureScore: 0,
      failedPolicies: ['server-not-registered'],
      passedPolicies: [],
      issues: [`Server ${payload.serverId} is not registered.`],
      recommendedNextAction: 'Register server through POST /api/validate/server before scanning.',
    };
  }

  const validation = validateServerRegistration({
    name: server.name,
    endpoint: server.endpoint,
    transport: server.transport,
    authMethod: server.authMethod,
    oauthScopes: server.oauthScopes,
    declaredTools: server.declaredTools,
    owner: server.owner,
    environment: server.environment,
  });

  const failedPolicies: string[] = [];
  const passedPolicies: string[] = [];
  const issues: string[] = [...validation.issues];

  for (const policy of policies) {
    let failed = false;

    if (policy.id === 'pol_least_privilege_oauth') {
      const writeOrAdmin = server.oauthScopes.some((s) => /(write|admin)/i.test(s));
      failed = writeOrAdmin;
    }
    if (policy.id === 'pol_no_auth_destructive') {
      const destructive = server.declaredTools.some((t) =>
        /(delete|drop|remove|truncate|wipe|exec)/i.test(t)
      );
      failed = server.authMethod === 'none' && destructive;
    }
    if (policy.id === 'pol_tls_minimum') {
      failed =
        (server.transport === 'http' || server.transport === 'sse' || server.transport === 'streamable-http') &&
        !server.endpoint.startsWith('https://') &&
        server.transport !== 'stdio';
    }

    if (failed) {
      failedPolicies.push(policy.id);
      issues.push(`Policy violation: ${policy.name}.`);
    } else {
      passedPolicies.push(policy.id);
    }
  }

  let status: 'pass' | 'review' | 'fail';
  if (validation.postureScore >= 80 && failedPolicies.length === 0) {
    status = 'pass';
  } else if (validation.postureScore >= 55 && failedPolicies.length <= 1) {
    status = 'review';
  } else {
    status = 'fail';
  }

  let recommendedNextAction: string;
  if (status === 'pass') {
    recommendedNextAction = 'Continue scheduled posture scans on default cadence.';
  } else if (status === 'review') {
    recommendedNextAction = 'Schedule platform security review within 7 days.';
  } else {
    recommendedNextAction = 'Quarantine server, suspend agent traffic, escalate to SecOps.';
  }

  return {
    serverId: server.id,
    status,
    postureScore: validation.postureScore,
    failedPolicies,
    passedPolicies,
    issues,
    recommendedNextAction,
  };
}
