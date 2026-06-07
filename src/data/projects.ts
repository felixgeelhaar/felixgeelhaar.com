// Single source of truth for the project shelf. Consumed by / (top 3
// cards) and /work (full list). Content carried over from the v0 /lab
// page when the v1 IA folded lab into work (brand docs/ia.md).
//
// Order matters: the first three appear as the home-page work cards.

export interface Project {
  title: string;
  /** Mono status line, e.g. 'active · Go'. */
  status: string;
  summary: string;
  href: string;
  /** Paid products get a badge and sit in their own /work section. */
  paid?: boolean;
}

export const paid: Project[] = [
  {
    title: 'Armada',
    status: 'paid · Atlassian Marketplace · TypeScript',
    summary:
      'Campaign orchestration for Jira — turn one parent issue into 50+ child issues across teams, with fan-out strategies per team, live mission control, fleet management, recall safety rails, approval gates, templates, and multi-stage rollouts. Ships on the Atlassian Marketplace. Product site: armada.run.',
    href: 'armada', // site-relative; pages prefix BASE
    paid: true,
  },
];

export const projects: Project[] = [
  {
    title: 'Nomi',
    status: 'active · Go + Tauri',
    summary:
      'Local-first AI coding agent. Plan review before execution, capability-gated tools, BYO LLM (Ollama / Anthropic / OpenAI). Tauri desktop + Go daemon — your repo never leaves your laptop unless you decide otherwise.',
    href: 'https://github.com/klarlabs-studio/nomi',
  },
  {
    title: 'Roady',
    status: 'active · Go',
    summary:
      'Plan-of-record for AI coding agents. Spec, plan, and drift detection that survive context resets. File-based, git-versioned, MCP-native.',
    href: 'https://github.com/felixgeelhaar/roady',
  },
  {
    title: 'TokenOps',
    status: 'active · Go',
    summary:
      'Local MCP server + CLI that tracks Claude Max / ChatGPT Plus/Pro/Team / Copilot / Cursor plan windows and warns before you hit the cap. Output-side coach detects compressed reply styles.',
    href: 'https://github.com/felixgeelhaar/tokenops',
  },
  {
    title: 'Scout',
    status: 'active · Go',
    summary:
      'Browser automation in one binary. Simpler alternative to Playwright — no Node, no Python, no runtime. Library, CLI, MCP server, chat UI.',
    href: 'https://github.com/klarlabs-studio/scout',
  },
  {
    title: 'Fortify',
    status: 'active · Go',
    summary:
      'Production-grade resilience for Go services calling LLMs and tools. Circuit breaker, retry, rate limit, timeout, bulkhead, fallback, hedge, adaptive concurrency, cost budget, stream timeout. Zero core deps.',
    href: 'https://github.com/klarlabs-studio/fortify',
  },
  {
    title: 'Bolt',
    status: 'active · Go',
    summary:
      'Zero-allocation slog.Handler for Go with first-class OpenTelemetry. Same encoder behind a chained-builder API for hot paths. Includes a genai add-on for the OTel GenAI semantic conventions.',
    href: 'https://github.com/klarlabs-studio/bolt',
  },
  {
    title: 'Statekit',
    status: 'active · Go',
    summary:
      'Typed statechart engine for Go. Hierarchy, guards, actions, parallel states, snapshots, lint, visualization. Same primitives for backend domain workflows and AI agent runtimes.',
    href: 'https://github.com/klarlabs-studio/statekit',
  },
  {
    title: 'Mnemos',
    status: 'active · Go',
    summary:
      'Evidence layer for AI agents — claims, contradictions, citations. Self-hostable. Wrappers in TypeScript and Python.',
    href: 'https://github.com/klarlabs-studio/mnemos',
  },
  {
    title: 'Nox',
    status: 'active · Go · Apache 2.0',
    summary:
      'Open-source security scanner with first-class AI app security: prompt injection at the call site, embedding leakage, agent over-privilege, MCP hardening, cross-file AI taint, polyglot AIBOM. Offline-first, agent-native via MCP. Lives at nox-hq.dev.',
    href: 'https://nox-hq.dev',
  },
  {
    title: 'Cognitive stack',
    status: 'active · Go',
    summary:
      'Five composable Go libraries for AI agent runtimes: Mnemos (memory), Chronos (time/pattern perception), Nous (commitment extraction), Praxis (typed actions), Olymp (control plane). Domain-agnostic.',
    href: 'https://github.com/felixgeelhaar?tab=repositories&q=chronos+nous+praxis+olymp',
  },
  {
    title: 'mcp-go',
    status: 'active · Go',
    summary:
      'Go framework for building MCP (Model Context Protocol) servers. Used by most of the projects above.',
    href: 'https://github.com/klarlabs-studio/mcp-go',
  },
  {
    title: 'Govee Light Management',
    status: 'stable · TypeScript',
    summary:
      'Stream Deck plugin for managing Govee smart lights, with advanced group functionality. Local API, no cloud app required.',
    href: 'https://github.com/felixgeelhaar/govee-light-management',
  },
  {
    title: 'cclint',
    status: 'active · TypeScript',
    summary:
      'Fast, extensible linter for CLAUDE.md context files. Validates and optimises the rules an AI agent reads at session start.',
    href: 'https://github.com/felixgeelhaar/cclint',
  },
];
