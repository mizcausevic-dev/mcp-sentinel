import { policies } from '../data/audits.js';

export function listPolicies() {
  return policies;
}

export function findPolicy(id: string) {
  return policies.find((p) => p.id === id);
}
