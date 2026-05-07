import { policies } from '../data/audits';

export function listPolicies() {
  return policies;
}

export function findPolicy(id: string) {
  return policies.find((p) => p.id === id);
}
