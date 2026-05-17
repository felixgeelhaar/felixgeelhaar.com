---
title: "Three MCP tools in, you've started rebuilding Gin. Stop."
summary: "Hand-rolling MCP servers on raw SDKs means re-solving input decoding, validation, schema generation, errors, middleware, and transports — five times, in five repos, each slightly wrong. The protocol is the easy part."
date: 2026-05-12
readingMins: 5
draft: false
kind: project
project: mcp-go
---

The Model Context Protocol is a few dozen pages of spec. Reading it takes an afternoon. Implementing it correctly takes two days. Implementing it *well enough to put in production* takes three months — and most of those three months are spent re-solving the same boring problems every HTTP framework solved fifteen years ago.

Input decoding. Schema generation that doesn't drift from the handler. Error mapping. Middleware: auth, timeouts, structured logging. Transport wiring for stdio versus HTTP. Each one is a couple hundred lines you'll write three times in three projects before you notice you're doing it.

That's the situation MCP is in right now. The protocol is fine. The application is the work.

## The framework primitive.

Web servers solved this years ago. You don't build a production HTTP service on raw `net/http` because Gin or Echo or Fiber handles the boilerplate — routing, binding, validation, middleware, response rendering — and lets you spend your time on the business logic that's actually unique to your service.

MCP servers need the same thing:

- **Typed handlers** — input and output shapes declared once, validated automatically, schema generated from the types instead of hand-maintained alongside them.
- **Middleware** — auth, rate limit, timeout, logging, tracing — composable, applied per-tool or globally, not copy-pasted into every handler.
- **Transport abstraction** — stdio versus HTTP versus future transports as a configuration concern, not a control-flow one. Business logic doesn't know how it got called.
- **Error handling** — one mapping from typed Go errors to MCP error responses, applied consistently, instead of every handler reinventing the discriminator.

Once that scaffold exists, the server code becomes the application — what your tools actually do — and the framework eats the protocol concerns.

## What goes wrong on raw SDKs.

A partial list of the patterns that show up in MCP servers built straight on the SDK:

1. **Hand-rolled input decoding.** Every tool handler starts with twenty lines of JSON decode + type assert + error wrap. Each one is slightly different. None of them get audited together.

2. **Schema drift.** The schema you advertise to clients was hand-written six months ago. The handler has since added two optional fields and removed one required one. The schema still says it's required. Clients still send it. Nobody knows.

3. **Errors swallowed and remapped four times.** Domain error → infrastructure error → tool error → MCP error → JSON-RPC error. Each layer loses information. By the time the client sees the response, "transient database timeout" reads as "internal error."

4. **Logging middleware copy-pasted per handler.** Eleven tools, eleven nearly-identical log statements at the top of each function. Update the log format and you update eleven places. Forget one and that tool is dark in production.

5. **Stdio versus HTTP baked into business logic.** The handler's third line is `if config.Transport == "stdio" { ... }`. Adding SSE in six months means a third branch in every handler. The transport leaked into the domain.

6. **No timeout on tool execution.** A buggy or runaway tool call blocks the server until the client gives up. The MCP layer doesn't enforce a deadline because nobody added one. The first incident is the one that teaches the team to add one — by handler, manually.

7. **Auth wiring duplicated per tool.** Each tool checks the bearer token, validates the scope, returns 401 in slightly different shapes. Some tools require auth that don't need to. One tool doesn't check at all because it was added in a rush.

8. **Tools that pass validation but fail invariants.** The schema accepts the input. The decoder produces a valid struct. The tool runs, mutates state, and discovers two fields are mutually exclusive on the eighteenth line. Now you're rolling back. Validation needs to be a layer of its own.

Each of these is a couple of hours of work to fix the first time. By the fifth tool, the same fix in a slightly different shape is taking the same two hours each. By the tenth, you've stopped writing tools because the friction tax got too high.

## The fix is the framework primitive.

You don't need my framework. You need *a* framework. The primitive — typed handlers + middleware + transport abstraction + uniform error mapping + automatic schema — is what makes MCP servers shippable instead of bespoke.

I built [mcp-go](https://github.com/felixgeelhaar/mcp-go) because the existing options in Go either give you protocol correctness without application structure (the SDKs) or convenience without the production defaults you need at the third tool, the third client, and the second incident (the lighter wrappers). mcp-go is opinionated, production-ready, conformance-tested against the MCP spec, and gets out of your way once the scaffold is up. v1.11 ships now.

But the framework is downstream. The point is the primitive. If you're three MCP tools into a server and the third one is harder to write than the first one was, you're not building a server. You're rebuilding the framework, one handler at a time.

Pick the abstraction. Then ship the tools.
