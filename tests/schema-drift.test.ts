import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateToolSchema } from '../src/governance/schema-drift';

test('schema-drift: first snapshot establishes baseline', () => {
  const result = evaluateToolSchema({
    serverId: 'srv_test_baseline',
    toolName: 'create_issue',
    description: '',
    inputSchema: { title: 'string', body: 'string' },
    destructive: false,
    requiresApproval: false,
  });
  assert.equal(result.status, 'allowed');
  assert.equal(result.drift, 0);
});

test('schema-drift: parameter addition is detected', () => {
  evaluateToolSchema({
    serverId: 'srv_test_drift',
    toolName: 'merge_pr',
    description: '',
    inputSchema: { repo: 'string', pr_number: 'number' },
    destructive: false,
    requiresApproval: true,
  });
  const result = evaluateToolSchema({
    serverId: 'srv_test_drift',
    toolName: 'merge_pr',
    description: '',
    inputSchema: { repo: 'string', pr_number: 'number', force: 'boolean' },
    destructive: false,
    requiresApproval: true,
  });
  assert.ok(result.added.includes('force'));
  assert.notEqual(result.status, 'allowed');
});

test('schema-drift: parameter removal is detected', () => {
  evaluateToolSchema({
    serverId: 'srv_test_remove',
    toolName: 'list_users',
    description: '',
    inputSchema: { team_id: 'string', limit: 'number' },
    destructive: false,
    requiresApproval: false,
  });
  const result = evaluateToolSchema({
    serverId: 'srv_test_remove',
    toolName: 'list_users',
    description: '',
    inputSchema: { team_id: 'string' },
    destructive: false,
    requiresApproval: false,
  });
  assert.ok(result.removed.includes('limit'));
});
