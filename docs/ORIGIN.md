# Why We Built This

`mcp-sentinel` came out of a pattern that showed up repeatedly in enterprise platform work: new automation surfaces would appear faster than governance models around them. Long before Model Context Protocol became something teams were naming explicitly, there was already a visible gap between what AI systems could reach and what operators could confidently control. Internal assistants were being connected to file systems, ticketing tools, CI systems, knowledge stores, and customer data planes. The tooling around those integrations was improving quickly. The governance story was not.

What we kept seeing at scale was not a lack of security products. It was a mismatch between existing security products and the actual operating problem. Traditional API security tooling could tell you whether an endpoint was exposed, whether TLS was present, and sometimes whether auth was configured correctly. AppSec scanners could find code smells. Cloud posture tools could point at infrastructure drift. But none of those systems were built to answer the questions platform and security teams were starting to ask about agent-connected tool surfaces:

- Which MCP server is exposing destructive capabilities into production?
- Which one changed its schema without approval?
- Which invocation patterns look like prompt injection or sensitive-data exfiltration?
- Which server is technically reachable, but operationally not safe to trust?

That gap became more obvious as adjacent AI systems hit familiar problems such as unstable RAG quality, hallucination-driven operator confusion, and weak evidence chains. We had already seen what happens when platform teams are asked to trust AI workflows without clear provenance, policy outcomes, or accountable ownership. MCP simply made that problem more operational. Once agents can call tools, the question is no longer just whether the model answered badly. The question is whether the system can act badly.

Existing tools missed the mark because they were optimized for one slice of the problem at a time. Some focused on LLM red teaming. Some focused on secrets. Some focused on API posture. Some focused on observability. Very few were CISO-legible and operator-usable at the same time. Even fewer were designed to fit naturally into CI and release workflows rather than living as a one-off assessment artifact.

So the design philosophy for `mcp-sentinel` became straightforward:

- **operator-first** so platform teams can see what changed, why it matters, and what should happen next
- **CISO-legible** so the output is usable in risk review, not just engineering triage
- **CI-native** so governance can run where MCP servers are registered, changed, and promoted

That is why the project emphasizes posture scores, policy outcome matrices, audit records, drift checks, and recommended actions instead of just generating raw findings.

What comes next is equally practical. The roadmap is not about turning this into a vague “AI security platform.” It is about deepening the control surface: persistent posture history, live polling agents across stdio/SSE/streamable HTTP transports, OPA or Cedar-backed policy authoring, richer incident export paths, and stronger links between MCP governance, evidence retention, and fleet-level observability. The goal is simple: make MCP safe enough to operate like real platform infrastructure, not a sidecar experiment.
