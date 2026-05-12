# Changelog

All notable changes to this project are documented here.

This log is intentionally written as an engineering record rather than a release-announcement stream. Dates reflect when the idea, design, prototype, and public packaging phases matured enough to document.

## [1.0.0] - 2026-05-06

### Released
- Published `mcp-sentinel` as a public portfolio-grade governance engine for Model Context Protocol server posture.
- Documented the core operator workflows around:
  - MCP server registration review
  - tool-surface risk scoring
  - schema-drift detection
  - prompt-injection scanning
  - PII and credential pattern detection
  - posture scoring and recommended next action
- Added the public Swagger/OpenAPI surface and dashboard summary endpoints to make the engine readable to both engineers and security stakeholders.
- Framed the project as an enterprise platform capability rather than a generic "AI security scanner."

### Why this mattered
- By 2026, the MCP governance gap was no longer theoretical. Teams were already connecting agents to ticketing systems, code hosts, CRMs, and internal data tools with inconsistent auth posture and very little centralized review.
- Existing security tools could see the infrastructure, but not the intent and blast radius of agent-exposed tool surfaces.

## [0.1.0] - 2026-02-14

### Shipped
- Cut the first coherent internal version of the posture engine.
- Standardized the server registration object around endpoint, transport, auth method, owner, environment, and declared tools.
- Added early policy checks for destructive tool exposure, missing auth, and weak production registration posture.
- Introduced the first combined posture score so platform and security teams could talk about MCP risk in one language.

### Notes
- This version was less about completeness and more about proving the model: MCP governance needed to be CI-native and operator-readable, not trapped in a slide deck or buried in a pentest note.

## [Prototype] - 2025-09-18

### Built
- Created the first runnable prototype that compared MCP server declarations over time and flagged schema drift.
- Added a signature library for prompt-injection and exfiltration patterns informed by the same failure modes later popularized in the OWASP LLM Top 10:
  - instruction override
  - prompt exfiltration
  - unsafe tool invocation
  - sensitive data exposure
- Started treating tool invocations as operational evidence, not just request logs.

### Problem pressure
- Adjacent RAG systems were already struggling with hallucination rates, stale retrieval context, and policy drift. MCP added a different class of risk: agent actionability with insufficient governance at the tool boundary.

## [Design Phase] - 2024-06-21

### Designed
- Defined the core philosophy for the system:
  - operator-first
  - CISO-legible
  - CI-native
  - suitable for mixed platform / AI / security teams
- Chose posture scoring, policy outcome matrices, and audit records as the right outputs instead of a raw vulnerability list.
- Separated three problem classes that many teams were mixing together:
  - registration governance
  - schema and contract drift
  - live invocation risk

### Rejected approaches
- Avoided building a pure research demo centered only on jailbreak strings.
- Avoided reducing the system to static config linting, because the real risk lives in how tool surfaces evolve and how agents invoke them.

## [Idea Origin] - 2023-11-03

### Observed
- Enterprise AI teams were beginning to expose internal capabilities through emerging agent and tool interfaces, but governance thinking was still mostly API-centric or model-centric.
- Review processes were strong around identity, secrets, and traditional service exposure, yet weak around machine-initiated tool use, approval semantics, and destructive-action visibility.

### Insight
- There was no practical "control point" translating MCP-style tool exposure into language security, platform teams, and legal/compliance stakeholders could all use.
- The seed idea for `mcp-sentinel` was that the missing product was not another model benchmark. It was an operational review layer for agent-connected tool ecosystems.

## [Background Signals] - 2022-08-09

### Context
- Earlier platform work in identity, privileged access, release governance, and AI-assisted operator tooling made one pattern obvious: the dangerous systems are rarely the ones with no controls at all. They are the ones where controls exist, but are fragmented across teams and impossible to read in one place.
- That pattern became the conceptual foundation for this repo long before MCP itself became a named surface area.
