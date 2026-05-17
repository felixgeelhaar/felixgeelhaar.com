---
title: "Jira can run a 200-team campaign. The defaults can't."
summary: "Security patches, migrations, compliance audits — large-scale initiatives are fan-out problems Jira's defaults don't solve. Teams reach for spreadsheets and lose every benefit of the workflow they left."
date: 2026-02-01
readingMins: 6
draft: false
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

## The fix is the orchestration primitive.

You don't need my app. You need *an* orchestration layer that treats campaign as a first-class concept on top of Jira's workflow engine. Build it internally, buy one off the marketplace, or accept the spreadsheet tax — those are the three honest options.

I built [Armada](https://github.com/felixgeelhaar/armada) — an Atlassian Forge app, ships in the Atlassian Marketplace — because the off-the-shelf options either rebuild Jira (a separate UI you have to teach) or add a field (an enhancement, not a primitive). Armada is an issue-panel UI on top of Jira itself: smart fan-out, live mission control, fleet persistence, recall with safety rails, approval gates, templates, multi-stage campaigns, Compass integration for team discovery and metrics rollup. v4.2 ships now.

But the app is downstream. The point is the primitive. If your org runs anything that touches 50+ teams at once — security patches, migrations, compliance, incident response — and the orchestration lives in a spreadsheet, you're carrying the cost of the missing layer every quarter and calling it "how we do it here."

Pick a layer. Stop running campaigns on grids.
