import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateServerRegistration } from '../src/governance/server-validator';

test('validateServerRegistration: healthy production server passes', () => {
  const result = validateServerRegistration({
    name: 'Slack Enterprise MCP',
    endpoint: 'https://mcp.slack.com/v1',
    transport: 'streamable-http',
    authMethod: 'oauth2',
    oauthScopes: ['channels:read'],
    declaredTools: ['list_channels', 'search_messages'],
    owner: 'collab-platform',
    environment: 'production',
  });
  assert.equal(result.status, 'allowed');
  assert.ok(result.postureScore >= 80);
});

test('validateServerRegistration: no-auth + delete tool in prod is blocked', () => {
  const result = validateServerRegistration({
    name: 'Risky MCP',
    endpoint: 'https://danger.example.com/mcp',
    transport: 'streamable-http',
    authMethod: 'none',
    oauthScopes: [],
    declaredTools: ['delete_record', 'read_record'],
    owner: 'unknown',
    environment: 'production',
  });
  assert.equal(result.status, 'blocked');
  assert.ok(
    result.issues.some((i) => i.toLowerCase().includes('destructive')),
    'expected destructive-tools issue'
  );
});

test('validateServerRegistration: write-scope OAuth gets flagged', () => {
  const result = validateServerRegistration({
    name: 'Github Org MCP',
    endpoint: 'https://api.githubcopilot.com/mcp',
    transport: 'streamable-http',
    authMethod: 'oauth2',
    oauthScopes: ['repo', 'read:org', 'workflow'],
    declaredTools: ['list_repos', 'create_pr'],
    owner: 'devx',
    environment: 'production',
  });
  assert.notEqual(result.status, 'blocked');
  assert.ok(
    result.issues.some((i) => i.toLowerCase().includes('write')),
    'expected write-scope flag'
  );
});
