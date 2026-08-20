# Aethelgard

> A procedural, single-player fantasy RPG inspired by tabletop role-playing games.

Aethelgard is a browser-based RPG focused on **procedural generation, systemic gameplay, player agency and replayability**.

Each campaign begins from a deterministic **seed**. That seed generates a coherent world, characters, factions, quests, encounters and other gameplay elements. The goal is not to generate an infinite AI-written story, but to build a **systemic RPG engine capable of producing many different adventures from the same underlying rules**.

The game is designed to run **without runtime AI or external AI APIs**. AI is used during development as a coding, design and prototyping tool rather than as a dependency of the final game.

---

## Vision

Aethelgard should feel like a solo tabletop RPG translated into a modern browser game.

The player should be able to:

- Create a character.
- Enter a procedurally generated fantasy world.
- Explore locations and discover events.
- Meet persistent NPCs.
- Interact with factions.
- Accept and complete branching quests.
- Fight enemies using deterministic RPG rules and dice.
- Make decisions that alter the state of the world.
- Save a campaign and return to it later.
- Start another campaign from a different seed and experience a different adventure.

The central design principle is:

> **The magic should come from the systems, not from an AI API.**

---

# Core Principles

## 1. Procedural First

The world should be generated from a deterministic seed.

The same seed must always produce the same initial world.

Different seeds should produce meaningfully different worlds.

Procedural generation should prioritize **coherence over randomness**.

## 2. Systemic Rather Than Scripted

Aethelgard should not depend on one large, linear campaign.

Instead, systems should interact:

```text
World
  ↓
NPCs + Factions
  ↓
Quests + Events
  ↓
Player Actions
  ↓
Consequences
  ↓
Changed World State
  ↓
New Events
```

The goal is for stories to emerge from gameplay systems.

## 3. Player Agency

The player should have meaningful choices.

Actions should depend on context and current game state.

The game should support freedom without requiring an LLM to interpret every action.

## 4. Determinism

The game engine should calculate gameplay results independently from visual presentation.

```text
rollD20()
    ↓
result = 17
    ↓
game state updated
    ↓
dice animation displays 17
```

The visual dice animation must never determine the actual result.

## 5. Offline-First Runtime

The final game should not require Gemini, Claude, OpenAI, other LLM APIs or external runtime services.

The game should be playable locally once loaded.

---

# Development Workflow

Aethelgard is developed using:

- **Claude Code** — primary coding and implementation agent.
- **GitHub** — source control and repository.
- **Linear** — product roadmap, Projects, Issues and priorities.
- **AI tools** — development assistance, prototyping, ideation and implementation support.

The workflow is:

```text
IDEA
 ↓
LINEAR
 ↓
ISSUE
 ↓
CLAUDE CODE
 ↓
IMPLEMENTATION
 ↓
TEST
 ↓
GIT COMMIT
 ↓
GITHUB
 ↓
LINEAR UPDATE
```

Linear is the source of truth for **what should be built**.

The repository is the source of truth for **what has actually been implemented**.

---

# Linear Workflow

## Project Statuses

- **Backlog** — valid idea, not currently committed to the roadmap.
- **Planned** — part of the roadmap and intended to be built.
- **In Progress** — currently being actively developed.
- **Completed** — fully implemented and considered finished.
- **Canceled** — intentionally abandoned.

Most roadmap Projects should remain **Planned** until development begins.

## Priority Levels

### Urgent
Core functionality that blocks or defines the project.

### High
Important gameplay functionality required for a strong playable experience.

### Medium
Important supporting functionality that can be developed after the core.

### Low
Polish, optional features and long-term improvements.

---

# Development Rules

## Before coding

1. Check Linear for the relevant Project and Issue.
2. Understand the current implementation.
3. Read relevant documentation and existing code.
4. Avoid duplicating existing systems.
5. Confirm the task fits the current development phase.
6. Define what "done" means before implementation.

## While coding

- Keep systems modular.
- Avoid unnecessary abstractions.
- Prefer deterministic logic.
- Keep game state explicit.
- Separate game logic from UI.
- Avoid runtime AI dependencies.
- Do not rewrite functioning systems without a reason.
- Preserve existing behaviour unless the Issue explicitly changes it.
- Add tests for important deterministic systems.
- Keep changes focused.

## After coding

```text
Implementation
 ↓
Local testing
 ↓
Regression check
 ↓
Git commit
 ↓
GitHub push
 ↓
Linear update
```

Each completed Issue should receive a concise summary of what changed, important decisions, tests performed, known limitations and follow-up work.

---

# Git & GitHub Workflow

Use Git throughout development.

Recommended branches:

```text
main
 ├── feature/...
 ├── fix/...
 ├── refactor/...
 └── experiment/...
```

Examples:

```text
feature/procedural-world-generator
feature/seed-system
feature/dice-engine
fix/quest-state-transition
refactor/game-state
```

Prefer concise commits:

```text
feat: add deterministic seed generator
feat: add procedural region generation
fix: prevent invalid quest states
refactor: separate game state from UI
test: add seed reproducibility tests
docs: update development workflow
```

---

# Aethelgard Development Phases

## Phase 1 — Foundation

### Project: Foundation & Game Engine

**Status:** In Progress  
**Priority:** Urgent

**Goal:** Build the deterministic engine that powers the entire game.

**Scope:** deterministic seed system, seeded RNG, central GameState, player/world state, game clock, action/event systems, state transitions, save/load, local persistence, data schemas, TypeScript types and validation.

**Definition of Done:** A seed produces a deterministic initial GameState. The player can interact with the world, modify the state, save the campaign and restore it later with the state preserved.

---

## Phase 2 — Procedural Adventure

### Project: Procedural World Generation

**Status:** Planned  
**Priority:** Urgent

**Goal:** Generate coherent fantasy worlds from seeds.

**Scope:** kingdoms, regions, biomes, climate, mountains, forests, rivers, lakes, roads, cities, villages, ruins, caves, dungeons, temples, points of interest, geographic constraints and traversability validation.

**Definition of Done:** The same seed produces the same world, while different seeds produce substantially different but coherent worlds.

### Project: Player & RPG Systems

**Status:** Planned  
**Priority:** Urgent

**Goal:** Create the player's persistent RPG identity.

**Scope:** character creation, attributes, origins, archetypes, skills, abilities, HP, XP, levels, equipment, status effects, character sheet and progression.

**Definition of Done:** A player can create a character, use abilities, gain experience, progress and persist their character across sessions.

### Project: Quests & Dynamic Events

**Status:** Planned  
**Priority:** Urgent

**Goal:** Turn generated worlds into playable adventures.

**Scope:** quest templates, procedural quest generation, objectives, conditions, branches, dependencies, rewards, failure states, quest chains, hidden variables, world events, random encounters, conditional encounters, location events and time-based events.

**Definition of Done:** A generated campaign contains meaningful quests and events that can branch, succeed, fail and evolve according to player actions and world state.

---

## Phase 3 — Systemic RPG

### Project: Actions & Player Agency

**Status:** Planned  
**Priority:** Urgent

**Goal:** Allow players to meaningfully interact with the generated world.

**Scope:** talk, investigate, search, steal, sneak, persuade, intimidate, attack, defend, travel, rest, use item, observe, contextual actions, freeform action parser, validation and consequences.

**Definition of Done:** Player actions reliably modify game state and produce contextual consequences.

### Project: NPCs & Factions

**Status:** Planned  
**Priority:** High

**Goal:** Create persistent characters and social systems that respond to player actions.

**Scope:** NPC generation, identities, personalities, goals, relationships, memory, knowledge, locations, schedules, inventory, faction membership, faction generation, reputation, alliances, conflicts and faction relationships.

**Definition of Done:** NPCs and factions have persistent states that evolve as the player interacts with the world.

---

## Phase 4 — RPG Gameplay

### Project: Combat & Enemy Systems

**Status:** Planned  
**Priority:** High

**Goal:** Create deterministic, turn-based RPG combat.

**Scope:** combat state, initiative, turns, player/enemy actions, attack resolution, damage, defence, critical hits, status effects, enemy archetypes, behaviours, abilities, victory, defeat and loot.

**Definition of Done:** Players can enter, resolve and exit combat with all consequences correctly reflected in persistent game state.

### Project: Dice & Tabletop System

**Status:** Planned  
**Priority:** High

**Goal:** Create an engaging tabletop-inspired dice system connected to the game's rules.

**Scope:** d4, d6, d8, d10, d12, d20, d100, modifiers, advantage/disadvantage, multiple dice, roll history, dice tray, physics, animation, critical feedback and result presentation.

**Important Rule:** The engine calculates the result first. The animation only visualizes that result.

**Definition of Done:** Dice rolls are deterministic, visually satisfying and fully integrated with the RPG rules.

### Project: Items, Inventory & Economy

**Status:** Planned  
**Priority:** Medium

**Goal:** Support progression, exploration and rewards through a systemic item economy.

**Scope:** item schema, weapons, armour, consumables, quest items, tools, rare items, inventory, equipment, gold, shops, buying, selling, prices and loot generation.

**Definition of Done:** Items can be generated, acquired, equipped, used, traded and persisted correctly.

---

## Phase 5 — World & Presentation

### Project: Exploration & World Simulation

**Status:** Planned  
**Priority:** Medium

**Goal:** Make the generated world behave like a living environment.

**Scope:** travel, time progression, day/night, weather, NPC schedules, world events, environmental state, discovery, random encounters and location state.

**Definition of Done:** The world continues evolving as the player travels, rests and interacts with it.

### Project: Visual Experience & UI

**Status:** Planned  
**Priority:** Medium

**Goal:** Create Aethelgard's visual identity and polished pixel-art interface.

**Scope:** art direction, pixel-art language, typography, colour system, UI components, character creation, character sheet, inventory, quest journal, map, combat UI, dialogue UI, environments, weather effects, lighting, particles, transitions and micro-animations.

**Definition of Done:** All major gameplay systems are presented through a consistent, polished visual language.

### Project: Audio & Atmosphere

**Status:** Planned  
**Priority:** Low

**Goal:** Reinforce gameplay and environments through sound.

**Scope:** ambient audio, music, dice sounds, combat sounds, UI feedback, location ambience, environmental audio and dynamic audio.

**Definition of Done:** Major gameplay actions and environments have appropriate audio feedback.

---

## Phase 6 — Replayability

### Project: Replayability & Campaign Sharing

**Status:** Planned  
**Priority:** Low

**Goal:** Turn deterministic procedural generation into a major replayability feature.

**Scope:** multiple campaigns, campaign history, seed display, seed sharing, seed import, campaign export, daily seeds, challenge seeds and campaign metadata.

**Definition of Done:** Players can create different campaigns, return to previous campaigns and share seeds that reproduce the same initial world.

---

# Ongoing — QA & Validation

### Project: QA, Balancing & Procedural Validation

**Status:** In Progress  
**Priority:** Urgent

**Goal:** Ensure procedural systems remain stable, coherent and playable as the game grows.

**Scope:** unit tests, GameState validation, seed reproducibility tests, world generation tests, quest validation, combat tests, save/load tests, NPC state tests, edge cases, procedural stress tests, generated campaign validation and balance testing.

Aethelgard should eventually generate hundreds or thousands of seeds and identify broken worlds, unreachable locations, impossible quests, invalid game states, softlocks and broken progression.

---

# Runtime Architecture

The long-term architecture should conceptually separate:

```text
┌──────────────────────────┐
│        UI / Renderer     │
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│       Game Engine        │
│                          │
│  GameState               │
│  Rules                   │
│  Actions                 │
│  Events                  │
│  Combat                  │
│  Quests                  │
│  NPCs                    │
│  Factions                │
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│ Procedural Systems       │
│                          │
│ Seed                     │
│ World Generation         │
│ Quest Generation         │
│ NPC Generation           │
│ Encounter Generation     │
└────────────┬─────────────┘
             │
┌────────────▼─────────────┐
│ Local Persistence        │
│                          │
│ Save / Load              │
│ Campaigns                │
└──────────────────────────┘
```

The renderer should never become the source of truth for game logic.

---

# AI Development Policy

AI is welcome during development.

AI can be used to:

- Generate code.
- Explore implementation approaches.
- Prototype systems.
- Generate test cases.
- Debug problems.
- Refactor code.
- Generate development tooling.
- Explore procedural algorithms.
- Brainstorm content structures.

AI should **not** be required at runtime for the core game.

The goal is:

> **AI-assisted development, not AI-dependent gameplay.**

---

# Claude Code Workflow

Claude Code is the primary implementation assistant.

For significant tasks, Claude Code should:

1. Inspect the repository.
2. Check relevant Linear context.
3. Understand existing architecture.
4. Identify affected systems.
5. Implement the smallest coherent change.
6. Run relevant tests.
7. Check for regressions.
8. Summarize the implementation.
9. Update the corresponding Linear Issue.
10. Commit the change to Git.

Claude Code should not:

- Invent duplicate systems.
- Rewrite working architecture unnecessarily.
- Introduce AI APIs without explicit approval.
- Ignore existing project conventions.
- Mark work complete without testing.
- Treat prototypes as production-ready systems.

---

# Current Development Order

```text
1. Foundation & Game Engine
        ↓
2. Procedural World Generation
        ↓
3. Player & RPG Systems
        ↓
4. Quests & Dynamic Events
        ↓
5. Actions & Player Agency
        ↓
6. NPCs & Factions
        ↓
7. Combat & Enemy Systems
        ↓
8. Dice & Tabletop System
        ↓
9. Items, Inventory & Economy
        ↓
10. Exploration & World Simulation
        ↓
11. Visual Experience & UI
        ↓
12. Audio & Atmosphere
        ↓
13. Replayability & Campaign Sharing
```

QA, testing and balancing should happen continuously throughout all phases.

---

# Product North Star

Aethelgard succeeds when a player can enter a seed they've never played before and think:

> **"I have no idea what is going to happen in this world."**

And when they finish the session, the important story should have emerged from:

**their decisions + the rules + the generated world + the consequences.**

Not from a scripted campaign.

Not from an AI pretending to be a game master.

From the game itself.

---

## Project Status

Aethelgard is currently in **early development / prototyping**.

The existing prototype is considered an experimental foundation rather than a finished implementation of the final architecture.

The project is intentionally being developed iteratively.

The architecture, technology choices and individual systems may change as development progresses, provided they continue to support the core principles of deterministic procedural generation, systemic gameplay, player agency and replayability.
