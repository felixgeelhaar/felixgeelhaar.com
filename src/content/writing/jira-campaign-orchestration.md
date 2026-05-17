---
title: "Jira can run a 200-team campaign. The defaults can't."
summary: "Security patches, migrations, compliance audits — large-scale initiatives are fan-out problems Jira's defaults don't solve. Teams reach for spreadsheets and lose every benefit of the workflow they left."
date: 2026-02-01
readingMins: 8
draft: false
kind: project
project: armada
---

A security advisory drops. The patch needs to roll out across 87 teams. You open Jira to create the parent issue and stare at the blank screen for a minute.

Then what? Create 87 child issues by hand? Bulk-create via CSV that ignores per-team workflow rules, board mappings, and the fact that half the teams use sub-tasks and the other half use linked tasks across projects? Slack everyone individually with a link to the parent and ask them to create their own children? The honest answer most teams land on is the fourth option: skip Jira for the orchestration, run the campaign on a Google Sheet, paste the spreadsheet link into the parent issue as documentation, and lose every benefit of the workflow tool you supposedly use to coordinate.

The campaign happens. The visibility doesn't. The audit trail is a sheet someone deleted by accident in March.

## What the missing layer looks like.

Jira is a great per-team workflow engine. It's a poor cross-team campaign engine. The primitive missing isn't another field or a custom report — it's an orchestration layer that sits above the workflow and treats a campaign as a first-class object:

- **Fan-out engine.** One parent issue produces N children across N teams. Each child lands in the right project, in the right shape — sub-task here, linked task there, Epic child somewhere else — without the campaign owner needing to know each team's layout.
- **Live mission control.** A single view that rolls up status across all children. Weighted progress (not just count). Blocked vs review vs done. Per-team timeline showing who started, who's stalled, who's done.
- **Fleet management.** The team → project mapping is data, not knowledge. Stored, versioned, importable from sources of truth like Compass, deduped on update.
- **Safety rails.** Pre-flight health checks before launch. Recall paths that don't just delete children but transition + unlink with audit trails. Approval gates with named approvers for the launches that warrant them.
- **Templates.** The compliance review you run quarterly should be a template you reapply, not a campaign someone rebuilds from memory each time.
- **Multi-stage rollout.** A 200-team campaign isn't a single launch; it's wave 1, wave 2, wave 3, each gated. The runtime should know that.

None of that is Jira-the-product's job. It's a layer above Jira, plugged in via the API, that turns the per-team workflow engine into a cross-team campaign engine without forcing teams to abandon the rules they've already encoded.

## What goes wrong without it.

A partial list of failure modes I keep watching in security, migration, and compliance teams running large initiatives without an orchestration layer:

1. **Fan-out by hand.** Security engineer creates 87 child issues over three days. By the time they're done, the first batch is already stale because the advisory got an update. Two issues are in the wrong project. One team got missed.

2. **The spreadsheet that became the source of truth.** Campaign tracking moved to Google Sheets "just for this one." Six months later, the spreadsheet is the canonical state, Jira has stale tickets, and the auditor asks for an export that no longer reconciles with the workflow tool.

3. **Cross-project chaos.** Some teams accept sub-tasks; others require linked tasks because their boards filter sub-tasks out; the Epic-children teams have their own opinion. The fan-out script picks one strategy. Half the teams end up with invisible work because the strategy didn't match their setup.

4. **No safety on recall.** Campaign launches early. Need to pull it back. The recall is "delete the child issues" — but some teams have already done work, some have comments, some have linked PRs. The bulk delete loses all of it. Now the recall is the incident.

5. **No approval gate.** Anyone with edit access to the parent can launch the fan-out. A well-meaning PM clicks "launch" on a Tuesday morning thinking it's a draft. 87 teams get pinged simultaneously. The Slack threads do not converge.

6. **No live visibility.** Status is "open the parent and look at the children list" — 87 tickets, no rollup, no progress weighting, no timeline. The campaign owner builds a custom dashboard. The dashboard takes longer than the campaign.

7. **Templates not reused.** The quarterly compliance campaign has now been run six times. Each time someone rebuilds the launch config from memory — which teams, which fields, which approval rules. Each time it's slightly different. The campaign owner is the only person who knows the differences.

8. **Multi-stage rollout invented per campaign.** "Wave 1 = critical services, wave 2 = production-tier-1, wave 3 = everyone else" is a structure every large rollout reinvents. Each invention is bespoke. None of them are auditable. The org has run twelve waves; nobody can produce a list of which services went in which.

The shared cause: campaigns at this scale are a different shape from regular issue tracking, and the workflow tool wasn't built for that shape. Without a layer that takes the shape seriously, teams either reinvent it badly or escape from the tool entirely.

## But couldn't an agent just do this?

Fair question, and the default 2026 move for "I need to fan out across 87 teams" is "ask Claude (or GPT, or Cursor) to do it via Jira's MCP." The agent can list projects, create issues, link them, push updates. For one-off, exploratory work, go for it — the agent path is the right tool for "I need five children created right now and I'll never run this again." Quick, flexible, zero schema to maintain.

For anything that recurs, scales, or has consequences if it goes wrong, the agent path turns into the spreadsheet path with extra steps:

- **Determinism.** The agent's choice of fan-out strategy varies between runs. Sometimes it picks sub-tasks. Sometimes linked tasks. Sometimes the same prompt nudges it differently next Tuesday. Auditable only if you save the prompt *and* the response *and* the model version — which most teams don't. The deterministic app produces the same plan from the same inputs every time.

- **Permission model.** The agent acts with whatever Jira credentials its MCP token holds — usually a service account or someone's personal API token. Forge apps run inside Jira's own permission system with scoped grants declared in the manifest (`read:jira-work`, `write:jira-work`, `read:component:compass`, etc.) and reviewed by the admin who installs the app. The blast radius is bounded by the platform, not by hope.

- **Persistent state.** Campaign state in Armada lives as a property on the parent issue. Re-open the issue next quarter and the state is still there. Agent-driven campaigns live in the chat session that created them; close the chat, the state evaporates unless someone wrote it down.

- **Audit trail.** Forge logs every action through Atlassian's audit framework. Agent-driven actions land in Jira's history as "user X did this thing" without the *why*, unless you separately snapshot the prompts, the model responses, the tool-call sequences, and store them somewhere durable for the time horizon your auditor cares about.

- **Approval gates and recall safety.** Armada ships an approver allowlist and a recall path with audit comments. Both are first-class objects. Agent "approvals" are vibes — there's no enforced gate, just a sentence in the prompt. Agent recall is "agent, please undo that" and a hope that nothing was linked or commented on by humans in the interim.

- **In-product UI for non-engineers.** Armada renders as a Jira issue panel for the campaign owner — security PM, compliance lead, migration TPM — who isn't going to open a chat session every time they need a status check. Agent-driven workflows quietly assume every stakeholder is willing to live in the chat, which most stakeholders aren't.

- **Templates and multi-stage rollouts as data.** The quarterly compliance campaign is a saved template you reapply with variable substitution. The multi-stage rollout's wave definitions are persisted on the campaign object. Agent equivalents re-derive the structure from prose each time, which means the structure drifts each time.

The honest decision tree: if the campaign runs once, the rigour-vs-flexibility trade favours flexibility — let the agent do it. If the campaign repeats, scales past one person's working memory, or touches anything an auditor or a compliance team will eventually ask about, the trade-off flips. Deterministic, scope-bounded, audit-logged, permission-modelled, schema-versioned, in-product wins.

The two aren't competitors at the extremes. They're competitors in the middle, and the middle is where most large orgs actually operate. Plenty of room to use both: the agent to draft the campaign skeleton, the app to execute and govern it.

## Here's what we built that the agent path can't give you.

[Armada](/armada) — an Atlassian Forge app that ships in the Atlassian Marketplace — is the orchestration layer Jira was missing. v4.2 is live now. It treats campaigns as first-class objects on top of Jira's workflow engine and gives you the seven properties enterprise rollouts need that the ad-hoc agent path doesn't:

- **Deterministic fan-out** — same plan from same inputs, every time. Strategy per team is data, not a model call.
- **Forge-native permissions** — scoped grants declared in the manifest, reviewed by the admin who installs the app. Blast radius bounded by the platform, not by hope.
- **Persistent state on the parent issue** — open the campaign next quarter, the state is still there.
- **Audit trail through Atlassian's framework** — every approval, recall, nudge, and transition logged for the time horizon your auditor cares about.
- **First-class approval gates and recall safety** — approver allowlists, recall paths with audit comments, no "agent, please undo that and hope."
- **In-product UI for non-engineers** — security PM, compliance lead, migration TPM see status in the Jira issue panel without opening another tool.
- **Templates and multi-stage rollouts as data** — the quarterly compliance campaign is a saved template, not a campaign someone rebuilds from memory each time.

If your org runs anything that touches 50+ teams at once — security patches, migrations, compliance audits, incident response — and the orchestration lives in a spreadsheet today, that spreadsheet is costing you a recoverable amount of quarterly engineering throughput and an unrecoverable amount of audit defensibility.

**[Install Armada](/armada)** — 30-day free trial via the [Atlassian Marketplace](https://marketplace.atlassian.com/apps/2348071004/armada-campaign-manager-for-jira). Forge app runs inside your Jira tenant, so the data stays where your security review already approved it. Full product tour, screenshots, and pricing at [armada.run](https://armada.run).

Stop running campaigns on grids.
