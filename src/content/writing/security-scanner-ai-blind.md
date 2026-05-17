---
title: "Your security scanner can't see your AI code."
summary: "SAST tools stopped evolving at HTTP request validation. AI features live on top of HTTP, but the failure modes — prompt injection, embedding leakage, agent over-privilege, MCP hardening — happen at the LLM call site, in places traditional scanners don't look."
date: 2026-05-10
readingMins: 6
draft: false
kind: project
project: nox
---

You shipped a PR last week that added a `chat.completions.create` call. The model takes a user-supplied prompt, optionally fetches some files from disk, and returns a response that gets piped back to the user. The CI ran Snyk, SonarQube, and CodeQL. Everything was green.

Everything was also wrong. The user prompt flowed unsanitized into the model. The file-read tool wasn't scoped, so the user could exfiltrate anything the service had permission to read. The embedding step that runs nightly pushed three secret tokens into your vector store as searchable chunks. The MCP server you stood up to let internal tools talk to the model exposes a `command.exec` tool the upstream documentation marked optional. None of these are bugs in the libraries you imported. They're properties of the way you wired them together.

Your security scanner didn't catch any of it. Not because the scanner is broken. Because the scanner was designed for a world where the dangerous calls were `eval()`, `os.system()`, raw SQL strings, and unescaped templates. AI code lives on top of all of that and adds an entirely new failure surface that previous-generation SAST has never been taught to recognise.

## The primitive: AI-aware static analysis.

A security scanner that takes AI code seriously needs to do more than scan your imports. It has to understand the *shape* of an AI application well enough to flag the failure modes that only exist in that shape:

- **Prompt injection at the call site.** Recognise `chat.completions.create`, `anthropic.messages.create`, `ollama.generate`, etc. as taint sinks. Trace unsanitized user input from the request body across function boundaries and across files into the prompt argument. OWASP LLM01, named with a stable rule ID, not a generic "untrusted input" warning that fires on every string.
- **Embedding leakage.** Detect when secrets, API keys, or PII land in a vector store via the embedding pipeline — `pinecone.upsert`, `chroma.add`, the raw `embeddings.create` call followed by a write. The vector store is forever; the secret is now searchable.
- **Agent over-privilege.** When an agent context holds both `file_read` and `http_request` (or `shell_exec` and anything network-egress), flag the combination. Most teams add tools one at a time; nobody audits the *set*.
- **MCP server hardening.** Static checks for MCP server misconfigs: tools exposed without auth, transport not pinned to stdio for sensitive operations, missing input schema validation, manifest scopes wider than the tool actually needs.
- **AIBOM** — AI Bill of Materials. Polyglot inventory of every model invocation, every auth env var, every external endpoint the AI stack touches. Python ingest + Go service + TypeScript frontend produce *one* document an auditor can read.
- **Cross-file AI taint.** Most SAST gives up at function boundaries. AI code is glue code; the request handler in one file, the prompt builder in another, the model call in a third. The analyzer has to follow the value across the hop.

This isn't a feature wishlist for incumbent SAST. It's the contract a scanner has to honour to be useful on AI code at all.

## What goes wrong without it.

A partial list of failure modes I keep watching:

1. **Prompt injection ships green.** The PR introduces a new feature that takes user input, fans it into a system prompt template, and asks the model to do something. The reviewer reads "looks fine, model handles it." The scanner says nothing. Three weeks later the prompt-injection demo is on Twitter.

2. **Embedding leakage with no audit trail.** The nightly ingest job pulls support tickets into a vector DB. Some tickets contain bearer tokens copied into the body by users. The tokens are now embeddings. Nothing prevents retrieval into a chat session that surfaces them. The scanner that should have flagged the ingest path didn't model the embed → store → retrieve flow.

3. **Agent over-privilege normalised.** The agent runtime started with `file_read`. Someone added `http_request` to let it fetch documentation. Someone else added `shell_exec` to let it run tests. Each addition was reviewed in isolation. The combination is a remote-code-execution primitive shipping under "agent improvements" in the PR titles.

4. **MCP server exposed without scoping.** Stood up an MCP server for internal tools. The manifest declared every scope the SDK exposed because copy-paste. The server runs on stdio behind localhost — *for now*. The day it gets behind an authenticating reverse proxy, every tool is reachable by anyone who finds the URL.

5. **AIBOM doesn't exist.** Auditor asks "list every model you call, what data they receive, what auth you use, what region they run in." Answer is a grep across three repos, a Slack message to a contractor, and a hopeful guess at the contents of `.env.production`.

6. **Cross-file taint stops at the function boundary.** Single-file scanners flag the call but miss the path. The dangerous flow is: HTTP handler in `routes/chat.py` → builder in `services/prompt.py` → LLM call in `clients/openai.py`. Three files; the analyzer reads each one in isolation; the warning never fires.

7. **Dependency CVEs published, never reached.** The vulnerable function in the imported library isn't actually called. The scanner flags the dep anyway. Eighty noise findings a week, the team turns the scanner off in CI, the *real* finding ships unreviewed.

8. **Compliance gates set by a vendor SaaS.** Your security scanner is a hosted product. The CISO asks "where does our source code live during a scan." Answer: "vendor cloud, in `us-east-1`, indexed for 90 days." The compliance team rejects. Now the scanner runs nowhere.

The shared cause: AI-shaped code outran the security tooling, and the tooling has been bolting on AI features instead of being rebuilt around the new failure surface from the ground up.

## The fix is an AI-aware scanner you control.

You don't need my scanner. You need a scanner that names prompt injection at the call site, traces taint across files, models the embed-and-store path, audits the agent privilege set, hardens MCP servers, and produces an AIBOM your auditor can read — and that runs on your infrastructure without uploading source code to a SaaS.

I help maintain [Nox](https://nox-hq.dev) because the incumbent scanners were never going to be the right shape for this. Nox is open-source (Apache 2.0), Go, offline-first, agent-native via MCP, with a cosign-signed plugin marketplace and polyglot AIBOM across Python, Go, and TypeScript stacks. The default trust policy refuses unsigned third-party plugins. Source on [github.com/nox-hq/nox](https://github.com/nox-hq/nox); v0.10 ships now.

But the scanner is downstream. The point is that AI code is a new failure surface and the security playbook that worked for HTTP services doesn't cover it. If your CI is running yesterday's scanner against today's AI features, the green build is telling you about the wrong things.

Pick a scanner that knows what `chat.completions.create` does.
