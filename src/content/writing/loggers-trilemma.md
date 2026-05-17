---
title: "Pick performance, ergonomics, and observability. All three."
summary: "The Logger's Trilemma says you can have two of speed, developer experience, and observability. The trilemma was a sampling problem; modern slog handlers can ship all three."
date: 2026-05-09
readingMins: 5
draft: false
---

For most of the last decade, choosing a Go logger meant choosing two out of three:

- **Zap** — speed and DX, observability is your problem to bolt on.
- **Zerolog** — speed and DX, OpenTelemetry trace correlation is your problem to plumb.
- **slog** — DX and observability via the handler interface, performance is fine but allocates in the hot path.

That's the Logger's Trilemma. Like every trilemma, it was true under the assumption that one of the corners was structurally hard. In this case, the assumption was that zero-allocation logging and OpenTelemetry-correlated structured logging were architecturally incompatible — one required a hand-tuned encoder with no reflection, the other required a handler that knew about trace context and could enrich every record.

The assumption was wrong. The trilemma was a sampling artifact.

## What changed.

Go 1.21 shipped `log/slog` as the standard structured-logging interface. That moved the contract — what a logger looks like to application code — into the standard library and out of every library's slightly-different opinion about it. The `slog.Handler` interface is small enough that a custom implementation can do anything a custom logger used to do, and *application code never has to know which handler is underneath*.

Once the interface is standardized, the trilemma collapses into a handler problem. You need a handler that:

- **Allocates zero on the hot path** — no boxing, no reflection on every call, no string formatting until the record is actually written.
- **Implements `slog.Handler` correctly** — passes `testing/slogtest.TestHandler`, handles groups properly, supports `WithAttrs` and `WithGroup` without allocating per call.
- **Knows about OpenTelemetry** — pulls trace_id and span_id from `context.Context` on every emit, injects them as structured fields without the application having to remember.
- **Offers a chained-builder API for the hottest paths** — `logger.Info().Str("k", v).Int("n", 42).Msg("...")` — for the cases where slog's variadic interface is one indirection too many.

That's all of it. The corners of the trilemma turn out to be solvable jointly with a handler that takes both seriously, and the application code keeps the `slog` API it already learned.

## What goes wrong when one corner is missing.

A partial list of failure modes I keep watching in services that picked two:

1. **"We'll add observability later."** The team picks the fast logger because the API is good and the OTel story is "doable." Two years in, the OTel story is still "doable." Half the services have trace_id in logs, half don't, the incident bridge is a guessing game.

2. **Logger that allocates in the hot path.** Hot-path log statements show up in CPU profiles. The team's response is to lower the log level. Now the production logs are sparse. Now the incident has no breadcrumbs.

3. **Manual trace correlation plumbing.** Every handler explicitly threads `traceID` through five layers of function calls because the logger doesn't know how to read it from context. New code forgets. New code is most of the code that runs in production after six months.

4. **Two log formats in one service.** Hot path uses zap because it's fast. Cold path uses slog because the new code was written after Go 1.21. The aggregator has to parse two schemas. Half the dashboards work; half don't; nobody migrates the legacy because "it works."

5. **GenAI logging in plain prose.** The agent emits `log.Info("called tool", "name", toolName)`. The OpenTelemetry GenAI semantic conventions specify `gen_ai.tool.name`. The two never align. The trace exporter sees prose where it expected attributes.

6. **slog handler that fails slogtest.** Custom handler written internally because "it can't be that hard." It isn't tested against `testing/slogtest.TestHandler`. Six months later, a downstream consumer notices that grouped attributes aren't nested correctly. The team had been emitting subtly wrong JSON the whole time.

7. **Production logger benchmarked, never measured.** The README cites benchmark numbers. The team adopts on that basis. In production, logging is contributing 8% of CPU because the workload doesn't match the benchmark shape. Nobody measures because "we picked the fast one."

8. **The handler that knows about OTel but the SDK that doesn't.** Logger pulls trace_id from context correctly. The trace SDK was initialized late, after the first batch of requests. Those requests have spans but the logger's snapshot of "is OTel active" was cached at startup. The trace_id field is empty for the first ten minutes of every restart.

The thread connecting all eight: treating one corner of the trilemma as the sacrifice you accept up front. Each sacrifice has a cost. The costs compound over the life of the service.

## The fix is to stop accepting the sacrifice.

You don't need my handler. You need a handler that takes all three corners seriously and a logger interface (slog) that lets you swap the handler without touching application code.

I built [Bolt](https://github.com/felixgeelhaar/bolt) because I wanted the zero-allocation perf of zerolog, the slog ergonomics that the standard library now blesses, and the OTel correlation that production services need on day one, in one handler, with a single encoder behind both the `slog.Handler` interface and a chained-builder API for hot paths. The `genai` add-on annotates spans with the OpenTelemetry GenAI semantic conventions so AI calls show up in your traces correctly without each service inventing the mapping. v1.4 of the core and v0.1 of `genai` ship now.

But the handler is downstream. The point is that the trilemma was always a sampling artifact. If your logger picks two corners, the third corner is paying interest in your production environment whether you measure it or not.

Pick the handler that picks all three.
