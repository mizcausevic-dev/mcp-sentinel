import { env } from '../config/env';
import type { InvocationPayload } from '../schemas/validation-schemas';

const INJECTION_SIGNATURES: { pattern: RegExp; weight: number; label: string }[] = [
  { pattern: /ignore (all )?(previous|prior) instructions/i, weight: 0.55, label: 'instruction-override' },
  { pattern: /disregard (the )?(system|developer) (prompt|message)/i, weight: 0.5, label: 'system-override' },
  { pattern: /reveal( your)?( the)? (system )?prompt/i, weight: 0.45, label: 'prompt-exfil' },
  { pattern: /print( the)?( contents of)? \.env/i, weight: 0.6, label: 'env-exfil' },
  { pattern: /(read|cat|exfiltrate|exfil) [a-z0-9_./-]*\.(env|pem|key)/i, weight: 0.7, label: 'credential-exfil' },
  { pattern: /you are now (a |an |in )?(developer|admin|root|jailbroken)/i, weight: 0.5, label: 'role-hijack' },
  { pattern: /BEGIN[_-]?SYSTEM[_-]?MESSAGE|<\|im_start\|>system/i, weight: 0.6, label: 'sentinel-token-injection' },
  { pattern: /sudo|rm -rf|drop database/i, weight: 0.55, label: 'shell-or-sql' },
  { pattern: /forward (this|the) (email|content|data) to/i, weight: 0.55, label: 'data-exfiltration' },
  { pattern: /from now on,? (you (will|must)|act as)/i, weight: 0.4, label: 'persona-pivot' },
];

const PII_SIGNATURES: { pattern: RegExp; label: string }[] = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, label: 'ssn-like' },
  { pattern: /\b(?:\d[ -]*?){13,16}\b/, label: 'pan-like' },
  { pattern: /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/, label: 'iban-like' },
  { pattern: /sk-[A-Za-z0-9]{20,}/, label: 'api-key-like' },
  { pattern: /-----BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY-----/, label: 'private-key' },
];

export interface InvocationVerdict {
  status: 'allowed' | 'flagged' | 'blocked';
  riskScore: number;
  matchedSignatures: string[];
  piiMatches: string[];
  issues: string[];
  passedChecks: string[];
  recommendedNextAction: string;
}

export function evaluateInvocation(payload: InvocationPayload): InvocationVerdict {
  const issues: string[] = [];
  const passed: string[] = [];
  const matched: string[] = [];
  const piiHits: string[] = [];
  let risk = 0;

  const haystacks = [
    payload.promptContext ?? '',
    JSON.stringify(payload.arguments ?? {}),
    payload.resultPreview ?? '',
  ].join(' \n ');

  for (const sig of INJECTION_SIGNATURES) {
    if (sig.pattern.test(haystacks)) {
      matched.push(sig.label);
      risk += sig.weight;
      issues.push(`Prompt-injection signature matched: ${sig.label}.`);
    }
  }

  for (const pii of PII_SIGNATURES) {
    if (pii.pattern.test(haystacks)) {
      piiHits.push(pii.label);
      risk += 0.3;
      issues.push(`PII or credential pattern detected in payload: ${pii.label}.`);
    }
  }

  // Latency anomaly
  if (payload.latencyMs > 15000) {
    issues.push(`Tool latency ${payload.latencyMs}ms exceeds 15s threshold.`);
    risk += 0.1;
  } else {
    passed.push(`Latency ${payload.latencyMs}ms within healthy range.`);
  }

  if (payload.status === 'denied') {
    passed.push('Upstream denial recorded; defense-in-depth held.');
  }

  if (matched.length === 0 && piiHits.length === 0) {
    passed.push('No injection or PII signatures matched in invocation context.');
  }

  // Cap risk to [0, 1]
  risk = Math.min(1, risk);
  const riskScore = Math.round(risk * 100) / 100;

  let status: 'allowed' | 'flagged' | 'blocked';
  let recommendedNextAction: string;

  if (risk >= env.injectionRiskThreshold) {
    status = 'blocked';
    recommendedNextAction = 'Block invocation, alert SecOps, capture full context for forensic review.';
  } else if (risk > 0.25) {
    status = 'flagged';
    recommendedNextAction = 'Allow with audit trail; route weekly digest to platform security.';
  } else {
    status = 'allowed';
    recommendedNextAction = 'Allow invocation; continue routine logging.';
  }

  return {
    status,
    riskScore,
    matchedSignatures: matched,
    piiMatches: piiHits,
    issues,
    passedChecks: passed,
    recommendedNextAction,
  };
}
