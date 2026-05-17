---
title: "Your AI's memory is someone else's database."
summary: "Hosted memory layers and vector DBs hand the user's preferences, conversation history, and inferred claims to a vendor's infrastructure. The feature ships; the ownership doesn't."
date: 2026-05-17
readingMins: 6
draft: false
---

You bolt a hosted memory service onto your AI app. The user's preferences, the conversation history, the inferred claims about who they are, the things the agent has decided are true — all of it gets written to a vendor's API, billed per call, stored in their region, retrievable on their schedule, deletable on their terms.

The memory feature is real. The ownership is gone.

This isn't a hypothetical. It's the shape of the entire "AI memory" product category in 2026. Pinecone, Chroma, the hosted memory APIs from the model providers themselves — they all share the same architectural assumption: the memory layer is a service you call out to, not a primitive that runs on your infrastructure. That's fine if your users don't mind. It's a problem if your customer is a regulated business, an on-prem deployment, or anyone who reads their data-processing agreement closely.

## What "memory" should actually be.

A memory layer that's worth shipping needs four properties beyond just storing and recalling text:

- **Self-hostable.** Runs as a binary against your storage on your infrastructure. No vendor cloud in the data path. No per-call billing on the highest-frequency operation in the app.
- **Structured.** Events, claims, contradictions, evidence — first-class shapes, not blobs in a vector index. The structure is what makes the memory auditable.
- **Evidence-backed.** Every claim points to the inputs that produced it. When the agent "knows" something, you can trace why.
- **Replayable.** A decision the agent made on input X is reproducible. The same input replays to the same output, or surfaces the contradiction if it doesn't.

Vector search alone isn't memory. It's retrieval. The two get conflated because the first wave of LLM-app tooling treated "stuff the relevant context into the prompt" as the whole problem. It isn't. Knowing what's true, what's contradicted, and what's still uncertain — that's memory. Retrieval is the easy part.

## What goes wrong without it.

A partial list of failure modes I keep watching in AI apps that treat memory as an afterthought:

1. **Memory-as-vector-soup.** Everything goes into the same index as embeddings. No structure, no provenance, no update semantics. To change a fact, you have to find the right chunks and delete them — assuming you can identify them, which you usually can't.

2. **Per-call billing on the hottest path.** Memory writes happen on every interesting agent turn. Memory reads happen on every relevant agent turn. The pricing model is a per-call API. The cost scales with engagement. The most-used features become the most expensive to operate.

3. **Claims with no evidence.** The agent has decided the user is a vegetarian. Why? Because of a message six weeks ago that the support team can't surface, the user can't see, and the auditor will ask about during the next compliance review.

4. **Contradictions never surface.** Two facts in the memory store disagree. Both get retrieved when relevant. The agent reconciles them in prose, confidently, often wrong. Nobody knows the contradiction exists because no mechanism surfaces it.

5. **Replay is impossible.** The agent shipped a decision. Six weeks later, someone needs to know why. The conversation log has rolled out of retention; the model has been updated; the memory snapshot from that day is gone. The post-mortem becomes a guess.

6. **Memory leaks across tenants.** Multi-tenant app, shared memory store, scoping handled by a `WHERE tenant_id = ?` clause in retrieval. One missing scope check and tenant A's memory shows up in tenant B's session. The bug is undetectable in testing because both tenants look the same shape.

7. **Compliance review reduces to "we trust the vendor."** The auditor asks where user data is stored. The answer is a vendor's name and a SOC 2 report. The answer to "can you delete it" is "we can ask them to." The answer to "can you prove it's deleted" is silence.

8. **The decay nobody planned.** Memory written by the agent on day 1 is still load-bearing on day 200, even though the user has changed jobs, switched preferences, and explicitly contradicted three of the original claims. Without a contradiction mechanism, the stale facts win because they were there first.

The thread connecting all eight: treating memory as a vendor problem instead of a primitive your app owns. The vendor APIs are good. They're also the wrong abstraction for an app that needs to know what it remembers, why, when, and on whose behalf.

## The fix is the primitive.

You don't need my binary. You need the shape — events, claims, contradictions, evidence, replay — running somewhere you control.

I built [Mnemos](https://github.com/felixgeelhaar/mnemos) because the existing options either give you cloud convenience without the ownership properties (the hosted services) or storage without structure (the vector DBs). Mnemos is a Go binary, an HTTP API, and SQLite or Postgres on your infrastructure. Every claim has evidence. Every contradiction surfaces. Every decision replays. No SDK to install; any language with an HTTP client integrates in five lines. v0.15 ships now.

But the binary is downstream. The point is the primitive. If you're building an AI app and the answer to "where does the memory live" is a vendor's region, the answer to "what happens when the vendor changes its pricing or its terms or its uptime" is "we find out."

Your AI's memory should be in a database you can `grep`.
