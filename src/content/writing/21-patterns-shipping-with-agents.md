---
title: "21 patterns I keep seeing in teams shipping with AI coding agents."
summary: "A partial, in-progress list of the recurring dysfunctions, anti-patterns, and quiet wins from teams that ship software with AI coding agents day-to-day. Working notes, not a framework."
date: 2026-05-17
readingMins: 8
draft: false
kind: essay
---

This is a working list. It will be wrong in places, incomplete in others, and probably right where it makes someone uncomfortable.

I'm writing it down because the conversations I have with engineering leaders about "how do we adopt AI coding agents" mostly stall on vocabulary. We don't have names for the things that are actually happening. So we argue past each other about tooling instead of describing the system.

Here are 21 patterns I keep seeing. Some are dysfunctions. A few are quiet wins. Most are the kind of thing you only notice after the team's been at it for three to six months. None of them are the agent's fault, exactly. They're shapes that emerge once you bolt a confident-sounding non-human into a software org.

Add yours.

---

1. **Eager execution.** The agent starts editing files the moment it has a hypothesis. The plan it just produced was a formality. (The most common gateway dysfunction; everything else follows from it.)

2. **Approval theatre.** Humans are in the loop on paper. In practice, by step three of a fifteen-step plan, they're pressing approve while reading something else. The loop exists; the attention does not.

3. **Context laundering.** Important constraints get compressed out across turns. The agent "knows" the rule on turn two; by turn nine it has politely forgotten it; on turn ten it ships code that violates it.

4. **The diff illusion.** The agent writes 200 lines. Six of them actually do the work. The other 194 are renames, formatting, and incidental refactors. The reviewer can't tell which six matter, so they review all 200, badly.

5. **Spec drift.** The README the agent reads says what the system was supposed to be. The codebase reflects what it became. Every session, the agent is six months out of date.

6. **Prompt sprawl.** Every engineer on the team has a slightly different prompt for the agent. None of them are version-controlled. The team is, functionally, running 12 different products.

7. **The cleanup tax.** Undoing an over-eager agent's work costs more than doing the original task by hand. Nobody bills this back to the agent's productivity score.

8. **Cost amnesia.** Per-feature LLM spend is unknown until the quarter closes. The biggest spend is always the one nobody owned. (See: tokenops, my attempt to drag this into daylight.)

9. **Snapshot rot.** The agent's view of the world is N minutes stale and it plans against the stale view anyway. The plan is internally consistent and externally already wrong.

10. **The agreeable agent.** The user pushes back on the agent's correct answer. The agent capitulates and gives the wrong answer the user wanted. Everyone leaves the session confident.

11. **Permission fatigue.** Capability prompts work for the first 50. By the 200th, the human is granting filesystem-write and shell-exec the way you accept cookies — eyes down, click through.

12. **Plan inflation.** The agent generates a fifteen-step plan for a two-step problem. Each step looks reasonable in isolation. The user approves it because disagreeing is more work than approving.

13. **Silent fallbacks.** A tool call fails. The agent quietly downgrades to a worse strategy and doesn't tell anyone. The output looks the same; the quality doesn't.

14. **The promotable artifact.** The agent makes something that looks polished — clean diff, full test file, neat commit message — without working. The polish is the camouflage.

15. **Loop-of-one.** The agent gets stuck improving a thing the user no longer cares about. It iterates on it for forty minutes because each iteration is locally rewarding and globally pointless.

16. **The fluent failure.** Confident prose for the wrong problem. The agent writes a beautiful explanation of why the bug is in module X. The bug is in module Y.

17. **Memory rot.** The agent's persistent memory from three weeks ago is now load-bearing in a new session. Nobody knows what's in it. Nobody can audit it. It's distorting current plans through invisible weight.

18. **The receipt gap.** When something goes wrong, you can't reconstruct what the model actually saw. No audit trail back to the inputs. The post-mortem becomes a vibe check.

19. **Tool budget exhaustion.** The agent burns its tool-call budget on plumbing — reading files, listing dirs, checking git status — and runs out of room before it reaches the actual work. The user blames the model. It's the harness.

20. **Capability cliff.** The agent is reliably good at task A. Phrase the same task slightly differently — task A-prime — and quality falls off a ledge. Nobody knows where the ledge is until they're past it.

21. **The metric vacuum.** "Agent productivity" gets reported as commits-per-week or PRs-merged. Neither measures what the agent actually changed: the shape of the work, the cost of review, the half-life of the code. The metric you can count is the wrong one.

---

What I'm missing — and would steal from you:

- The patterns specific to multi-agent setups (orchestrators, planners, sub-agents). I have fewer reps there.
- The patterns in regulated environments. The compliance shape of "agent reads PHI / PII" is its own beast.
- The patterns inside game studios, embedded teams, and ML/data orgs — places where the codebase shape doesn't match the SaaS-Go/TS-Python template most agent tooling assumes.

If you've named one I missed, send it. I'll add it with the credit.

Two open questions I don't have answers for:

- **What's the half-life of a pattern name?** Some of these will be obsolete in six months because the tooling catches up. Some will outlive the current generation of agents. I can't tell which is which yet.
- **What's the right unit of measurement?** Commits, diffs, tasks, sessions, all wrong in different ways. The shape of agent-assisted work doesn't match the shape of the metrics we ship today. (This one might be a whole essay.)

This list is partial on purpose. The naming matters more than the completeness.

Send me the ones I missed. I'll add them and credit you.
