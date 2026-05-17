---
title: "Agents forget two ways. Most memory tools only fix one."
summary: "Plan-of-record and evidence layer are different primitives, solving different forms of forgetting. Most agent runtimes collapse them into one — or skip both — and pay the cost in the wrong direction."
date: 2026-05-17
readingMins: 7
draft: false
kind: essay
---

Two weeks into a long-running project, you ask your agent a question. The shape of the answer reveals which memory it lacks.

If you ask **"what were we supposed to do next on the migration?"** and the agent fumbles — confusing the plan it agreed to last week with whatever it last touched today — it lacks a *plan-of-record*. The intent has been lost to the context window. The agent isn't off-track because it chose to be; it's off-track because the track itself was never written down anywhere it could re-read.

If you ask **"why did you decide the new column should be nullable?"** and the agent improvises a justification it didn't have a week ago — confident, plausible, completely invented — it lacks an *evidence layer*. The claims it has made and the reasoning behind them have rolled out of the conversation. The agent will happily produce a new answer that contradicts last week's, and neither of you will notice.

These are two different memories. Confusing them is the reason most agent runtimes feel like they "forget" even when they have storage attached. Skipping both is the reason most agents drift. Picking one and assuming it covers the other is the reason teams ship a memory feature and still get bug reports about the agent making things up.

<pre class="mermaid">
flowchart LR
  subgraph Plan[Plan-of-record  ·  future-facing]
    Spec[Spec]
    PlanSteps[Plan]
    Drift[Drift]
  end
  subgraph Evidence[Evidence layer  ·  past-facing]
    Events[Events]
    Claims[Claims]
    Contradictions[Contradictions]
    Replay[Replay]
  end
  Spec --> PlanSteps --> Drift
  Events --> Claims --> Contradictions
  Claims -. cited by .- Replay
  PlanSteps -. references .- Claims
  Drift -. reads facts from .- Claims
  Events -. written during .- PlanSteps
</pre>

## The two primitives.

**Plan-of-record** is future-facing. It answers: *what is the agent supposed to do, and where is reality drifting from that intent?*

The artifacts are spec (the goal and its constraints), plan (the ordered decomposition into steps), and drift (the gap between intent and codebase). File-based, git-versioned, written before the agent acts. Any agent — same session, next session, different agent picking up the work tomorrow — can re-read the same three artifacts and resume with the same model of what it's doing and what it isn't allowed to do.

This is what [Roady](https://github.com/felixgeelhaar/roady) provides.

**Evidence layer** is past-facing. It answers: *what has the agent decided is true, on what basis, and what contradicts it?*

The artifacts are events (the inputs), claims (the structured assertions the agent has made from those inputs), contradictions (the surfaced conflicts when two claims disagree), and replay (the ability to re-run the same input and get the same output, or surface a divergence). Structured, queryable, auditable. The agent's "knowledge" is no longer an opaque embedding store; it's a database you can `grep`.

This is what [Mnemos](https://github.com/felixgeelhaar/mnemos) provides.

The two artifacts answer different questions on different timelines. A plan-of-record without an evidence layer means the agent knows what to do but not what to believe. An evidence layer without a plan-of-record means the agent knows what's true but not where it's going.

## When each one fires.

A partial list of moments where the difference matters:

1. **"Agent, what's next?"** Plan-of-record. The agent reads the open tasks in the current sub-project, picks the next ready one, and reports status. No re-derivation; the answer is on disk.

2. **"Agent, why did you say the schema should be nullable last week?"** Evidence layer. The claim was logged with its inputs. Replay is possible. The reasoning isn't reconstructed from vibes.

3. **"Agent, you committed to migrate to Postgres on Tuesday. What changed?"** Plan-of-record plus drift detection. The plan said Postgres-by-Tuesday. The drift detector says the code is still on SQLite. The gap is surfaced as a structured object, not noticed by accident.

4. **"Agent, the user says they're vegetarian, but last month you noted they prefer steakhouse recommendations. Which is right?"** Evidence layer with contradiction detection. Both claims exist. Both have provenance. The conflict surfaces *before* the agent confidently recommends the wrong restaurant.

5. **"New agent picking up tomorrow — where are we?"** Both, in order. Plan-of-record tells the new agent what work exists, what's in flight, what's blocked, what's done. Evidence layer tells it what facts about the system have already been established. Without the first, the agent doesn't know what to do. Without the second, it spends three turns relearning what the previous agent already knew.

6. **"Audit: what changed in this customer's account over the last quarter, and on what basis?"** Evidence layer, full stop. Plan-of-record can show what work was done; the evidence layer is what makes the *why* defensible to compliance.

7. **"Mid-task: agent, slow down — there's a constraint you're not respecting."** Plan-of-record. The constraint was in the spec. The agent re-reads, recognises the violation, adjusts. Without the spec on disk, the constraint lived in turn 2 of a conversation now compressed beyond recovery.

8. **"Memory write from session A is now load-bearing in session N. Where did it come from?"** Evidence layer with provenance. The fact is traceable to the input that produced it. Without provenance, the answer is "the agent thinks it's true and we have no idea why" — which is the answer most teams currently have.

The shared pattern: plan-of-record covers *intent and progress*; evidence layer covers *knowledge and provenance*. The agent runtime that conflates them gives you a plan that mysteriously knows facts the user never gave it, or a memory store full of claims that have no relationship to any defined work.

## They compose. They don't substitute.

A mature agent runtime has both, separately, talking to each other through narrow interfaces:

- The plan-of-record references claims from the evidence layer when constraints depend on them. ("Don't migrate the schema until the evidence layer says the dependency audit is clean.")
- The evidence layer writes events as the plan executes ("on completion of task X, claim: feature flag Y is enabled in environment Z").
- Drift detection lives in the plan-of-record but reads code-state facts from the evidence layer when the drift is semantic rather than structural.
- Replay lives in the evidence layer but executes against the plan-of-record's task definitions so a re-run produces the same decisions.

You don't have to use my tools. You do have to recognise that these are two primitives. A team that picks Roady alone gets future-facing memory and assumes the past-facing kind will emerge from chat logs. (It won't.) A team that picks Mnemos alone gets past-facing memory and assumes the agent will infer its plan from the evidence each session. (It won't, reliably.) The two cover different failure modes and are cheap to compose once they exist as separate things.

The other valid answer is: pick one for now, commit to writing the other when the failure mode shows up. Almost every team that adopts an agent runtime in 2026 will need both within six months. The teams that planned for both from the start will spend that six months shipping features; the teams that didn't will spend it retrofitting.

Plan. Evidence. Two memories. Compose deliberately.
