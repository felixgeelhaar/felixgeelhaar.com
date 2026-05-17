---
title: "Switch statements are a state machine in denial."
summary: "Every team modeling order lifecycles, payment sagas, incident workflows — and now AI agent runtimes — ends up with the same 400-line switch block, three boolean flags, and a Slack channel where the bugs surface. The fix is to make the FSM a first-class artifact."
date: 2026-05-17
readingMins: 6
draft: false
---

Open any production Go service that's been running for more than two years. Find the file that handles the order lifecycle, or the payment saga, or the incident workflow, or the KYC flow. It will be the same shape every time: a 400-line `switch event.Type { ... }` block, ten case branches, three boolean flags (`isPaid`, `isCancelled`, `isRefunded`), one `TODO: think about partial failure` comment from 2024, and a recurring Slack thread where the bugs surface.

That switch is a finite state machine. It just isn't designed like one. Nobody drew the diagram. Nobody enumerated the legal transitions. Nobody added the lint that catches "this event in this state should be impossible." The states are implicit, the transitions are accidental, and the partial-failure cases are handled per case branch by whoever was on call when each one fired.

Then the team adopts AI agents and discovers the agent's runtime is also one of these switches — `if last_action == "tool_call" { ... } else if last_action == "user_response" { ... }` — and the same class of bug ships in a new vocabulary.

## The statechart primitive.

A statechart is what an FSM becomes when you take it seriously:

- **Hierarchy** — composite states. "paying" contains "card_pending" and "card_authorized" and "card_failed". The parent handles the events the children all share; the children handle the differences.
- **Guards** — typed conditions on transitions. "PAID → SHIPPED only if address verified." Not buried in the handler. Visible in the machine.
- **Actions** — side effects with defined ordering: on entry, on exit, on transition. Idempotent by contract, retryable by construction.
- **Parallel states** — orthogonal regions running concurrently. The order can be both "paid" and "audit_in_progress" without booleans.
- **Snapshots** — serialize the whole machine, persist, restore. The workflow survives a restart without inventing custom persistence per case.
- **Lint + visualization** — the machine renders as a diagram. The lint catches structurally impossible transitions before they ship. Both come from the machine being a first-class artifact instead of a control-flow accident.

The trade-off is real: more upfront declaration, more vocabulary to learn, an abstraction the new hire has to read about. The trade-back is that the workflow stops being the place bugs hide.

## What goes wrong without it.

A partial list of failure modes I keep watching in switch-based workflow code:

1. **Switch-as-FSM with no exhaustiveness check.** A new event type ships. The handler doesn't have a case for it. The default branch silently no-ops. The bug surfaces three weeks later as "why didn't refund-requested do anything."

2. **Boolean flag soup.** `isPaid && !isCancelled && hasRefund && !isReshipped`. Four flags = sixteen states. The team has reasoned about maybe six of them. The other ten are theoretically reachable and quietly broken.

3. **Partial failure handled per case.** Each branch has its own retry logic, its own idempotency check, its own logging. Some have all three; most have one; one critical branch has none. Consistency is per-author.

4. **Idempotency invented per workflow.** "Make sure we don't double-charge" is a thing every payment integration solves locally. Each solution is slightly different. None of them are testable in isolation.

5. **No visualization.** Onboarding a new engineer to the order lifecycle means them reading 400 lines and asking three senior engineers what state means what. Six months later the new engineer is one of the three senior engineers; the diagram still doesn't exist.

6. **AI agent workflow = nested function calls + retry tries.** The agent's runtime is `runTool → onError → retry → onSuccess → callModel → onError → ...`. The state of the agent is the call stack. Persistence requires inventing a snapshot format from scratch.

7. **Persistence breaks on unexported fields.** The team adopts an FSM library. The library serializes via reflection. Half the state isn't exported because Go's visibility rules. Persistence silently drops half the workflow. The bug is found during a recovery drill, not in production, which is the only good news in this list.

8. **Recovery from error puts state in limbo.** A transition fails halfway. The machine is now in neither the "from" nor the "to" state. The next event arrives. The handler doesn't know what to do, so it logs a warning and exits the goroutine. The workflow sits, undead, until someone notices the queue is backed up.

The common cause: treating workflow logic as control flow when it's actually a state model. Control flow is what you reach for when the cases are linear. State models are what you reach for when the cases interact, fail, retry, and need to be visualized and audited.

## The fix is the primitive.

You don't need my library. You need the primitive — typed states, hierarchy, guards, snapshots, lint, visualization — as a first-class part of the workflow, not as the third refactor everyone postpones.

I built [Statekit](https://github.com/felixgeelhaar/statekit) because the existing Go FSM libraries are either flat (no hierarchy, no parallel states) or have ceilings the moment you need typed context, snapshot persistence, or recovery from a partial transition. Statekit is hierarchical, typed, lintable, visualizable, and runs the two adjacent jobs that look similar from outside: backend domain workflows (order, payment, incident) and AI agent runtimes (RAG pipelines, tool-call workflows, human-in-the-loop). Same primitives, one mental model. v1.5 ships now.

But the library is downstream. The point is the primitive. If your service has a 400-line switch and a recurring bug pattern around partial failure, the refactor isn't "clean up the switch." The refactor is "the switch was an FSM all along; let's let it be one."

Don't model a state machine with control flow. You'll lose every time.
