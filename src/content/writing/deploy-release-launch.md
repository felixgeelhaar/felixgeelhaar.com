---
title: "Deploy is not release. Release is not launch."
summary: "Three different verbs, three different owners, three different days. Decoupling them is the only honest way to ship software in 2026."
date: 2026-05-17
readingMins: 4
draft: false
kind: essay
---

There are three verbs. Most teams ship with one.

That's the bug. It's also the reason your last launch felt sloppy, your last release slipped on something unrelated to engineering, and your last deploy carried a press calendar on its back.

Decoupling is the only honest way to ship in 2026. The three-way version:

- **Deploy.** Code lands on production infrastructure. The binary is present; user-visible behavior is unchanged. The risk surface is correctness of the artifact — does it run, does it migrate cleanly, does it pass health checks. Should happen often, ideally several times a day, and ideally without anyone outside engineering noticing.
- **Release.** A switch is flipped. Behavior is exposed to a defined population — a flag for an internal team, a 5% cohort, a tier of accounts, every user in one region. The risk surface is product correctness — does the feature actually work for this slice. Should be reversible inside seconds and rehearsed often enough that the rollback is muscle memory.
- **Launch.** Attention is orchestrated. Press, sales, support enablement, comms, paid, lifecycle email. The risk surface is reputation and timing. Should never depend on a deploy or a release succeeding on the same calendar day.

The three answer different questions, are gated by different signals, and belong to different owners. Conflate them and every slip cascades for no engineering reason. The deploy waits on the launch comms approval. The release waits on the deploy that was rushed because the launch couldn't move. The press release fires before the flag flips. Everything is coupled by accident.

A partial list of what that coupling looks like:

1. **Launch-on-deploy.** Marketing fires on the deploy commit. Nobody checked the feature was actually exposed. Customers click the announcement link and land on yesterday's product. (Failure mode of a team that never built the release primitive.)

2. **Dark-launch never lit.** Code merged to main behind a flag months ago, gated on a flip that never came. The feature exists in the codebase and nowhere else. Eventually a cleanup PR deletes the flag because nobody remembers what it was for; the feature dies without ever being released.

3. **Flag sprawl.** Feature flags created for the launch, never removed after. Three years in, the codebase is hundreds of dead branches gated on flags whose meaning lives in one person's head — and that person is on parental leave. The release primitive rotted into config debt.

4. **Launch as engineering KPI.** Eng owns the launch date. GTM owns nothing. The OKR says "ship X by Q3". X ships. Nobody uses it. Both teams claim success and blame the other for the silence.

5. **Ramp without rollback.** Canary at 5%, then 50%, then 100%, with no defined gate to revert. Teams ramp on vibes. The first time the rollback is rehearsed is during the incident, at 3 a.m., against an engineer who hasn't touched the service in nine months.

6. **Comms-deploy coupling.** Press release locked to Tuesday 9 a.m. Deploy slips twelve hours. The press release fires anyway, because the comms calendar doesn't have a "wait for green" gate. Customers click into a feature that won't exist for the rest of the day.

7. **Reverse-launch is unsolved.** Easy to flip on. No defined process to flip off. Features become permanent on first 100% ramp because nobody owns the unship and the political cost of pulling back is higher than the operational cost of leaving a broken feature live.

The fix isn't a tool. It's three calendars.

Deploy on the engineer's calendar — as often as the artifact is ready, gated by tests and health checks. Release on the product's calendar — when the cohort is right, gated by the product-correctness signal you defined before you wrote the feature. Launch on the GTM's calendar — when the audience is assembled, gated on a green flag that the feature is fully released and the support team has been trained.

Different verbs. Different owners. Different days. When one slips, the other two don't have to.

That's the whole post. The vocabulary is the lever. Use the three words and use them for the things they actually mean, and a surprising amount of slippage disappears — not because the work got faster, but because the work stopped being coupled to itself by accident.
