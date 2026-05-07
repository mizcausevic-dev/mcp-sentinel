# MCP Sentinel

TypeScript observability, security audit, and governance portfolio project demonstrating MCP server registration validation, schema-drift detection, prompt-injection scanning, PII guardrails, and posture scoring for enterprise AI platforms running Model Context Protocol servers.

>
> *"I treat the Model Context Protocol surface as a platform-governance problem — auth posture, tool-surface risk, schema drift, and prompt-injection defense all rolled into a single operations layer."*

## Project Overview

| Attribute | Detail |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| Domain | Enterprise MCP server observability and governance |
| Validation Areas | Server registration · Auth posture · Tool surface risk · Schema drift · Prompt injection · PII redaction · Policy enforcement |
| Operational Outputs | Audit records · Incident records · Posture scoring · Policy outcome matrix |
| Docs | Swagger UI at `/docs` |

## Executive Summary

MCP Sentinel models the kind of internal control plane enterprise platform teams need once Model Context Protocol servers start landing in production. As soon as agents start calling MCP tools against Jira, GitHub, internal CRMs, filesystem sandboxes, and databases, the surface area for prompt injection, over-scoped OAuth grants, schema drift, and PII leakage explodes. There is currently no equivalent of "Datadog + Snyk + a CISO review" sitting between agents and MCP servers. This repo sketches what that layer looks like.

The API validates server registrations, scans tool surfaces for destructive verbs paired with weak auth, detects schema drift across polling cycles, scores live tool invocations for prompt-injection and PII signatures, and translates those checks into a posture score, an open-incident view, and a clear operator next action. The output reads like a real internal platform capability rather than a toy AI security demo, and the underlying domain logic is unit-tested and exposed through versioned routes.

## Architecture

```
Agent or assistant initiates a tool call
    |
    v
POST /api/validate/* and /api/security-scan
    |
    +--> Request validation (Zod)
    +--> Server-registration governance checks
    +--> Tool-schema drift evaluation
    +--> Prompt-injection signature scan
    +--> PII and credential pattern scan
    +--> Policy outcome matrix
    |
    v
Posture decision
    |
    +--> allowed   (continue routine polling)
    +--> flagged   (route to platform security review)
    +--> blocked   (quarantine server, alert SecOps)
```

## Governance Workflow

1. Platform teams submit server registration, tool schema, or live invocation payloads.
2. The service validates request shape with Zod.
3. Governance logic evaluates auth method, transport, OAuth scope hygiene, destructive tool surface, schema drift since baseline, prompt-injection signatures, and PII patterns.
4. The service returns a posture score, issues, passed checks, failed and passed policies, and a recommended next action.
5. Operators use `/api/dashboard/summary`, `/api/audits`, `/api/incidents`, `/api/policies`, and `/api/servers` for visibility into MCP fleet posture.

## Validation Model

### Server Registration Validation

Server registration scoring covers:

- authentication method appropriate for environment
- OAuth scope least-privilege review
- destructive tool surface paired with auth posture
- write tool exposure in production
- transport posture (HTTPS, mTLS, stdio risk)
- accountable owner declared

### Schema Drift Detection

Tool schema review catches:

- parameters added without approval
- parameters removed (client breakage risk)
- destructive or requires-approval risk-flag changes
- silent signature changes when parameter names match but types changed

### Invocation Risk Scan

Each tool invocation is evaluated against:

- prompt-injection signature library (instruction override, system-prompt exfiltration, env exfiltration, role hijack, sentinel-token injection, shell or SQL primitives, persona pivots)
- PII and credential patterns (SSN-like, PAN-like, IBAN-like, API key-like, private-key blocks)
- latency anomaly threshold
- upstream denial signals

### Posture Decision

The combined posture-check endpoint produces a single operational decision per server:

- production-ready
- needs-review
- blocked

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Service status and uptime |
| GET | `/api/servers` | List registered MCP servers |
| GET | `/api/servers/:id` | Fetch one MCP server record |
| GET | `/api/servers/:id/tools` | List declared tools for a server |
| GET | `/api/audits` | Audit history |
| GET | `/api/incidents` | Open and historical incidents |
| GET | `/api/policies` | Active governance policies |
| GET | `/api/dashboard/summary` | Operations summary view |
| POST | `/api/validate/server` | Validate a server registration payload |
| POST | `/api/validate/schema` | Validate a tool schema for drift and risk |
| POST | `/api/validate/invocation` | Validate an inflight tool invocation for prompt injection and PII |
| POST | `/api/security-scan` | Run combined security posture scan on a registered server |
| POST | `/api/posture-check` | Run combined production-readiness posture check on a server payload |

## Sample Validation Request

```json
{
  "name": "Internal CRM Bridge",
  "endpoint": "https://crm-mcp.internal.kineticgain.dev/mcp",
  "transport": "sse",
  "authMethod": "none",
  "oauthScopes": [],
  "declaredTools": ["lookup_account", "delete_contact", "export_contacts"],
  "owner": "revops",
  "environment": "production"
}
```

## Sample Validation Response

```json
{
  "status": "blocked",
  "postureScore": 35,
  "issues": [
    "Production server registered with authMethod=none.",
    "Destructive tools (delete_contact) exposed without authentication.",
    "Write-capable tools exposed in production without authentication."
  ],
  "passedChecks": [
    "Endpoint enforces HTTPS.",
    "Accountable owner declared: revops."
  ],
  "recommendedNextAction": "Block registration until destructive surface or auth posture is remediated."
}
```

## Screenshots

### Fleet Overview

![MCP Sentinel fleet overview dashboard showing servers, posture scores, and active incidents](docs/hero.png)

### Governance Validation Workflow

![MCP Sentinel live invocation stream and schema drift detection](docs/workflow.png)

### Posture Proof

![MCP Sentinel security scan report for a single server with policy outcome matrix](docs/proof.png)

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```
git clone https://github.com/mizcausevic-dev/mcp-sentinel.git
cd mcp-sentinel
npm install
cp .env.example .env
npm run dev
```

Visit:

- `http://localhost:3000/docs`
- `http://localhost:3000/api/servers`
- `http://localhost:3000/api/dashboard/summary`

### Run Tests

```
npm test
```

## What This Demonstrates

- Model Context Protocol governance translated into enforceable backend rules
- auth, transport, and tool-surface posture thinking applied to AI integration servers
- schema drift and approval-workflow modeling for evolving tool contracts
- prompt-injection and PII signature scanning treated as a first-class platform layer rather than a research afterthought
- collaboration-aware platform design for security, platform engineering, and AI product teams
- production-minded TypeScript API structure with docs, tests, and policy visibility

## Future Enhancements

- persist posture history and incident records in PostgreSQL
- ship a real polling agent that hits live MCP endpoints over stdio, SSE, and streamable HTTP
- integrate with OPA or Cedar for policy authoring
- add threat-intel feed for new prompt-injection signatures
- export incidents to PagerDuty, Slack, and SIEMs through a unified webhook adapter
- multi-tenant control plane for managed-service deployment

## Tech Stack

- Node.js
- TypeScript
- Express
- Zod
- Swagger / OpenAPI
- Helmet
- CORS
- Morgan
- Node test runner + Supertest

## Portfolio Links

- [LinkedIn](https://www.linkedin.com/in/mizcausevic/)
- [Skills Page](https://mizcausevic.com/skills)
- [Medium](https://medium.com/@mizcausevic)
- [GitHub](https://github.com/mizcausevic-dev)

Part of [mizcausevic-dev's GitHub portfolio](https://github.com/mizcausevic-dev) — demonstrating enterprise platform observability, AI governance, and web engineering thinking applied to the new Model Context Protocol surface.
