---
title: "Agents forget. The plan should remember."
summary: "AI coding agents lose context every session. The work doesn't. What survives the reset is the plan-of-record — and most teams don't have one."
date: 2026-05-16
readingMins: 6
draft: false
---

The agent is six tool calls into a refactor. It's asked clarifying questions, formed a plan, made three of the changes, opened a fourth file, paused to think. You hit context limit. Auto-compact runs. The summary keeps the headline of the task and loses the constraints, the half-formed decisions, the file you noticed needed touching second. Next turn, the agent starts again with a different mental model of the same job.

This is the cold open of working with AI coding agents in 2026. The context window is volatile, the model is happy to continue with whatever fragment survived, and the work — the actual job-of-record — has no home outside the conversation. So the conversation becomes the project. And the conversation forgets.

What you need is a thing that doesn't.

## Spec, plan, drift.

A plan-of-record is three artifacts, on disk, in git:

- **Spec** — what you're building and why. The constraints the agent should respect on turn one and on turn fifty.
- **Plan** — the ordered steps that turn the spec into code. Decomposed, owned, status-tracked.
- **Drift** — the gap between what the spec says and what the codebase does. Detected mechanically, not noticed by luck.

That's it. Markdown files would work; a wiki page wouldn't, because it doesn't version with the code; a chat transcript definitely wouldn't, because it doesn't survive the next compact. What matters is the contract: every session, any agent, can re-read the same three artifacts and resume with the same model of the work.

The plan-of-record isn't a project management tool. It's a memory tool for a workforce that can't keep its own.

## What goes wrong without it.

A partial list of failure modes I keep watching show up in teams shipping with agents:

1. **Cold-start tax.** Every new session, the agent re-reads the same files, asks the same clarifying questions, and lands on the same wrong assumption about what matters. The team is paying for the same onboarding ten times a day and calling it "agent overhead."

2. **Plan amnesia.** The agent proposed a twelve-step plan on turn two. By turn nine, it has executed steps 1, 3, and 7 — never the others, and not in the right order — because the plan never moved out of the chat into something it could re-read.

3. **Spec drift.** The README describes what the system was supposed to be. The codebase reflects what it became. The agent reads the README, plans against the imagined system, and writes code that fights the real one.

4. **Task-as-prompt.** The only place "the task" exists is the user's last message. Closing the chat closes the project. Reopening tomorrow is a new project with the same name.

5. **The mystery diff.** Agent shipped code. Nobody remembers what it was trying to accomplish or which constraints it had to respect. The reasoning lived in a chat log that has since rolled out of every reasonable retrieval window.

6. **Owner ambiguity.** Multiple agents working on overlapping pieces of the codebase, no shared truth about who's doing what. Each thinks it owns the migration. Two of them rewrite it. One of them deletes it.

7. **The lost decision.** The agent made a real call mid-session — database schema, API surface, error-handling pattern. The reasoning is in a paragraph it produced an hour ago and a model since compressed. The decision survives in code; the *why* survives nowhere.

8. **Cross-session handoff.** Agent A worked on this Tuesday. Agent B picks up Wednesday. B has no idea what A was doing, what A had ruled out, or what A had promised to come back to. B starts over. (Sometimes B is the same agent in a new session. The agent is also the second agent now.)

The cost of these isn't dramatic in any single instance. It's a slow drag. You stop noticing it the way you stop noticing the cost of a meeting that runs over by ten minutes. Then you look at the quarter and wonder why the team that adopted agents is shipping at the same rate as before, with twice the LLM bill.

## The fix is the primitive.

You don't need my tool. You need *a* tool. The primitive — spec + plan + drift, externalized, versioned with the code, accessible to any agent — is what matters. You can build it with three markdown files and a discipline. You can build it with Linear and a couple of conventions. You can build it inside Notion if your team will actually maintain it.

I built [Roady](https://github.com/felixgeelhaar/roady) because nothing I tried for the markdown-discipline path survived contact with real multi-agent work. The artifacts kept drifting because the agents couldn't *act* on them — they could only read. Roady exposes the spec, plan, and drift via MCP, so any agent can read, propose plan updates, transition task state, and detect drift as first-class operations. File-based, git-versioned, no service to host, no schema to migrate. The contract is the API. v0.12 ships nested sub-projects, a live Kanban that updates over SSE, cross-project boards, drag-and-drop transitions, and an auth gate for the boards that survive past localhost.

But the tool is downstream. The point is the primitive.

If you're shipping with AI coding agents and you don't have a plan-of-record that survives the next context reset, you're paying the cold-start tax on every session and calling the bill "the cost of doing business." It isn't. It's the cost of skipping the primitive.

Agents forget. The plan should remember.
