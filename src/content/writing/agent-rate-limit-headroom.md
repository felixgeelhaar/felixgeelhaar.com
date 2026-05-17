---
title: "Your AI subscription has a rate limit. Your agent doesn't know about it."
summary: "Flat-rate AI plans hide a cliff. The agent burns through your weekly Claude Max window, gets throttled mid-task, loses an hour of context. The fix isn't a different model — it's giving the agent visibility into the cap before it hits."
date: 2026-05-16
readingMins: 5
draft: false
kind: project
project: tokenops
---

You're forty minutes into a coding session with a Claude Max plan. The agent is mid-refactor across six files, has built up a working mental model of the codebase, and is about to start the third tool call of a multi-step migration. The response comes back: `rate_limit_exceeded`. The session resets. The next message tells you the window opens again in three hours.

You weren't watching a meter, because there isn't one. The provider knows your usage. The agent doesn't. So the agent kept committing to work it couldn't finish, the way a contractor without a budget happily quotes the next job.

This is the failure mode that subscription-tier AI plans built and nobody warns you about. The unit economics are friendly — flat rate, big window, "use as much as you want within reason" — but the window has a cliff, and the cliff is invisible to the workflow that's about to walk off it.

## The primitive: plan-window awareness.

The fix isn't a different model. It's giving the agent itself visibility into the cap, so the *agent* can decide to slow down, switch models, or wait for reset before it commits to work it can't finish.

That requires a few pieces:

- **Per-plan window tracking.** Different plans have different windows. Claude Max is a 5-hour window with a token cap. ChatGPT Plus/Pro/Team has a separate rolling cap. Copilot, Cursor, Mistral Le Chat Pro, Codex Plus all have their own shapes. The tracker has to know which plan you're on and what the window looks like for that plan.
- **Local usage telemetry.** Capture every request the agent makes from your machine. Aggregate per plan, per window. Compute headroom in real time.
- **Exposed to the agent via MCP.** Not a dashboard you check. A tool the agent calls. `tokenops_plan_headroom`, `tokenops_session_budget`, `tokenops_burn_rate`. The agent reads its own runway before it commits to a multi-step task.
- **Action vocabulary the agent can use.** `continue`, `slow_down`, `switch_model`, `wait_for_reset`. The agent doesn't just *know* it's about to hit the cap; it has a defined set of moves to take when it does.

Once the primitive exists, "rate-limit cliff" stops being an incident category and becomes a planning input.

## What goes wrong without it.

A partial list of failure modes I keep watching in teams running paid AI subscriptions at production cadence:

1. **The cliff with no warning.** Window resets at 2 p.m. You hit the cap at 1:50. You've now lost the last unit of work the agent was mid-flight on, plus ten minutes of waiting because the cliff didn't announce itself.

2. **Switch-model panic.** Cap hit. Workflow swaps from Claude to GPT or back. The new model has a different context format, different tool affordances, different failure modes. The first few interactions on the fallback are noticeably worse because the team never rehearsed the switch.

3. **The shared plan that fights itself.** Team shares a single Claude Max plan across four engineers. Engineer A is mid-refactor. Engineer B kicks off a documentation regeneration. Engineer C runs an unrelated lint sweep. The window closes for all three at once. Nobody was over their fair share; the plan had one budget for three workloads.

4. **The agent that doesn't know it's the agent.** Conversational use and agentic use share the same plan. A 200-tool-call agent run consumes the window the team thought was for chat. Next morning, the daily product question gets `rate_limit_exceeded` and the team thinks something's broken.

5. **Long-running plan that's actually short-running.** Agent estimates the migration will take 30 tool calls. It's already at 22 when the window's halfway burned. There's no projection of where the cap lands relative to the plan's remaining steps. The plan is technically on track and operationally about to die.

6. **Bursty work patterns invisible.** Some days the team uses 20% of the window. Some days 200%. Without rolling-window telemetry, the team can't tell which days exhaust the plan ahead of time and which days have room to spare. Planning becomes superstition.

7. **Cost amnesia for paid tiers.** Flat-rate plans feel "free" once paid. The team stops tracking usage because the line on the bill doesn't move. Then the usage spikes, the cap is hit, and the team has no historical baseline to know what changed.

8. **The audit gap for compliance.** Auditor asks "how much AI usage went into shipping feature X." Plan doesn't track per-feature or per-session usage. The answer is a shrug; the timeline is a guess.

The shared cause: AI plans were sold as "flat rate, big enough", treated as such by the team, and never instrumented because the instrumentation lives upstream at the provider — which doesn't expose it cleanly, and which the agent can't see in time to act on.

## The fix is local telemetry the agent can read.

You don't need my tool. You need the primitive — per-plan window tracking, local aggregation, real-time headroom — available to the agent at decision time, not after the fact on a dashboard.

I built [TokenOps](https://github.com/felixgeelhaar/tokenops) because I kept hitting the cliff in my own work and got tired of explaining to the agent that its plan was over. TokenOps is a local Go daemon plus an MCP server. It sniffs which AI clients are installed, binds plans, and exposes `tokenops_session_budget`, `tokenops_burn_rate`, `tokenops_plan_headroom`, and a browser dashboard the agent can hand you a link to. It speaks the action vocabulary — `continue`, `slow_down`, `switch_model`, `wait_for_reset` — so the agent has a defined move set when the headroom shrinks. v0.17 ships now.

But the daemon is downstream. The point is the primitive. If you're using a flat-rate AI plan for agentic work and the only way you find out you've hit the cap is the error message, the cliff is going to keep happening — until the agent can see the cliff itself.

Plan-window awareness is a primitive. Give it to your agent.
