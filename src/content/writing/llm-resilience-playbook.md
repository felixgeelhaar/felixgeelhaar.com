---
title: "LLM calls broke your resilience playbook. Add these back."
summary: "Retry, circuit breaker, timeout — the patterns that kept services up for two decades don't cover the failure modes of services that call LLMs and tools. Here's what's missing."
date: 2026-05-17
readingMins: 6
draft: false
---

The resilience playbook that worked for two decades — retry on transient failure, circuit breaker on persistent failure, timeout on the lot, bulkhead between dependencies — was designed for a world where backend calls failed cleanly. They returned 5xx, or they didn't. They were fast, or they timed out at a predictable boundary. The downstream cost of a retry was a network round-trip.

LLM calls and tool calls don't fail cleanly. They time out mid-stream. They throttle silently. They succeed and burn an eye-watering budget. They return a polite paragraph of confident nonsense. The standard playbook isn't wrong — it's incomplete for the shape of the new failure surface.

## The new primitives.

Resilience for AI-shaped calls needs all of the old patterns and a handful of new ones, composable in any combination because the right combination is workload-specific:

- **Circuit breaker** — open on persistent failure, half-open to probe.
- **Retry with jitter + backoff** — but with explicit caps and budget.
- **Timeout** — and a separate **stream timeout** for the bytes-per-second case.
- **Rate limit** — your side, not just theirs.
- **Bulkhead** — isolate the LLM provider from the rest of your dependency graph.
- **Fallback** — to a cheaper model, a cached answer, or a defined default.
- **Hedge** — fire a duplicate request after N ms; take the first response; cap the cost.
- **Adaptive concurrency** — tune in-flight requests against observed latency, not a hard-coded number.
- **Cost budget** — per request, per session, per tenant. Hard caps that return before the bill arrives.

Each is a wrapper around a call. Composition is the operating model. The cost is a few dozen lines of glue. The benefit is that production stops being an open-ended bet on the model provider's good behavior.

## What goes wrong without them.

A partial list of failure modes I keep watching:

1. **Naive retry on rate limit.** 429 comes back. The client retries immediately. The provider returns 429 again. The retry loop accelerates the throttle, the bill spikes, and the user gets a 504 anyway. Retry without a budget is amplification.

2. **Timeout-as-deadline kills mid-stream.** A 30-second timeout on a streaming call cancels the connection at second 30. Doesn't matter that bytes were flowing every 200 ms. The client throws away three quarters of a useful answer because the wall clock said so.

3. **Silent downgrade-and-pray.** Primary model throttles. Code falls back to the cheap model. Nobody logs the fallback. The user sees a worse answer; the team sees "everything green"; the support ticket arrives in a week with no breadcrumbs.

4. **No cost ceiling per request.** A single prompt with a runaway context can spend $40 of provider credit before returning. There's no gate that says "this request, this user, this session is allowed to cost N." The first time anyone notices is the monthly invoice.

5. **Bulkhead missing on the provider.** All outbound LLM calls share one connection pool. The provider has a bad five minutes. Every part of the app — the user-facing chat, the background batch summarization, the internal admin agent — degrades together because they're competing for the same starved pool.

6. **Hedge without a cap = 3× cost.** Hedging the slow tail is the right call until it isn't. Without a budget gate, every request fires two duplicate calls because "slow" got redefined down to "always". The latency P99 looks beautiful; the bill triples.

7. **Stream timeout equals full timeout.** No per-chunk gate. A stalled stream that emits one byte every 60 seconds is "succeeding" by the wall-clock test. The connection sits open, the user sees a spinner, the operator watches a metric that looks fine.

8. **Adaptive concurrency tuned for HTTP, not tokens.** Concurrency control optimised on requests-per-second is the wrong primitive when your bottleneck is tokens-per-minute. The model provider rate-limits on the token plane; your client throttles on the request plane; they disagree on what "saturated" means until the 429s arrive.

The shared cause of all eight: applying patterns designed for cheap, fast, binary calls to a class of calls that's expensive, slow, streaming, and probabilistic. The patterns still work. They just need the AI-shaped variants and they need to compose.

## The fix is the primitive set.

You don't need my library. You need the patterns, composed correctly for your workload, instrumented well enough that you can see them working.

I built [Fortify](https://github.com/felixgeelhaar/fortify) because the existing Go resilience libraries cover the classical patterns but leave the AI-shaped ones — stream timeout, cost budget, hedge with budget cap, adaptive concurrency tuned for token rate limits — as an exercise for the reader. Fortify ships them as composable middleware, with OpenTelemetry, Prometheus, and `slog` observability built in, and zero core dependencies. v1.5 ships now.

But the tool is downstream. The point is the primitive set. If you're shipping a Go service that calls an LLM or a tool, and you don't have at least timeout + circuit breaker + cost budget + stream timeout wrapping every outbound call, you're betting the service's uptime on the model provider's good behavior. The bet has good days. The bad days are very, very bad.

The old playbook isn't wrong. It's just not enough.
