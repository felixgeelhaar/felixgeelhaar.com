---
title: "Cloud coding agents read your repo. Yours doesn't have to."
summary: "Why local-first is the right default for AI coding agents — and what choosing it actually costs."
date: 2026-05-17
readingMins: 6
draft: false
kind: essay
---

The first time I watched a hosted coding agent open files in a private
repo I had not yet pushed, I noticed something quiet: I had never
agreed to that, exactly. The terms-of-service paragraph said something
generic about "providing the service." The product UX said "let's get
to work." Somewhere in the gap, my unfinished idea — fragments of a
strategy, half-formed names, the things I was still ashamed of — had
become a stream of tokens crossing the public internet to a model
provider's infrastructure for the rest of its retention window.

That gap is the whole conversation about AI coding agents, and almost
nobody is having it.

## The default is "trust us."

A modern coding agent does three things at minimum: reads your
filesystem, runs shell commands, and writes files. Hosted agents add a
fourth — they ship the first three out of your machine. Your repo
contents, your terminal history, the model's reasoning about both, and
the chain of tool calls connecting them all leave your laptop the
moment the agent is confident it should act. The model is always
confident.

The defenders of this arrangement point at SOC 2 reports and
zero-retention APIs and argue that the cloud is, in practice, secure.
That argument is true and beside the point. The point is that the
*default* is exfiltration. You opt out by reading docs, finding the
right toggle, trusting that the toggle is wired up correctly, and
accepting the latency and feature cuts that come with the privacy
mode. Most people don't bother. Most teams can't.

## Local-first is not a moral position.

It's an architectural one. A local-first agent runs the model — or at
least routes through the model — from a process that owns your
hardware. Conversations, secrets, tool call logs, and memory live in a
SQLite file or an OS keyring on the same disk as the code being
edited. Outbound network calls are an explicit capability, not a
default. The model provider can still be cloud-hosted (you'll often
want it to be), but the *agent* — the thing that reads, plans, and
acts — is yours.

What you get from that arrangement:

1. **The repo never leaves unless you decide it should.** The agent
   can read everything because everything is already on the same
   machine. There is no upload step to worry about.
2. **Tools become a capability list, not a vibe.** "Can write to my
   filesystem" and "can run shell commands" become explicit grants you
   give or revoke, not implicit assumptions buried in a system prompt.
3. **Plans are reviewable before execution.** When the agent is
   running in-process, there is no operational reason to start
   executing the moment the model emits a tool call. You can render
   the plan, ask the human, and only then proceed. Hosted agents
   technically can do this too; almost none do, because latency.
4. **Memory is a file you can read.** Not an opaque embedding store
   on someone else's S3 bucket. A SQLite database you can `grep`.

None of this requires you to give up cloud LLMs. Bring your Anthropic
key, your OpenAI key, your Ollama install. The model is a backend.
The agent is the part you should own.

## What it costs.

Honest tradeoffs:

- **You manage the runtime.** A hosted agent updates itself. A local
  one ships releases you have to install. The fix is good release
  hygiene and an auto-updater; the cost is real.
- **Multi-machine workflows are harder.** Your "memory" lives on the
  laptop it was created on. A headless daemon behind a reverse proxy
  helps, but the homelab path is more work than "open the same web
  app."
- **The smallest local models still aren't great.** If you're routing
  through Ollama against a 7B, you'll feel it. The local-first design
  doesn't claim the model is local — only that the agent is. Routing
  to a hosted model from a local-first agent is still local-first
  because you control the wire.
- **Onboarding friction.** "Install a Tauri app and pick an LLM
  provider" is a longer first run than "log in."

These are real. They are also fixable, and they trade for something
worth having: the boundary of your software stays where you can see
it.

## The version I built.

I shipped a coding agent that takes this position seriously. It runs
on your laptop. It plans every multi-step task and asks before it
runs. It exposes filesystem writes, command execution, and outbound
network as explicit capabilities you grant or deny. The memory is a
SQLite file. The same daemon runs headless on a homelab box for the
multi-machine case. You bring the LLM.

It is called [Nomi](https://github.com/felixgeelhaar/nomi). v0.1 is
out. The roadmap and the source are public. If this argument lands
for you, the install is one binary.

The point isn't the tool. The point is the default. The default
should be that your repo is yours.
