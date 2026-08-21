# Aethelgard — Game Design & Development Master Prompt

> **Working title:** Aethelgard  
> **Status:** Early Development / Prototype  
> **Genre:** Single-player procedural fantasy RPG / tabletop-inspired RPG / roguelite  
> **Target:** Browser-first, with future desktop/Steam compatibility  
> **Runtime AI:** None required  
> **Development approach:** AI-assisted / Claude Code + Linear + GitHub

---

# 1. MASTER OBJECTIVE

Build a single-player fantasy RPG that combines:

- The freedom and uncertainty of classic tabletop role-playing games.
- The systemic depth of traditional RPGs.
- The replayability and procedural generation of modern roguelikes/roguelites.
- A strong pixel-art visual identity.
- Deterministic, physical-feeling dice.
- Persistent NPCs, factions and world states.
- Branching quests and emergent stories.
- A campaign structure where every new game is generated from a unique seed.

The game should feel like:

> **A tabletop RPG transformed into a systemic, replayable videogame.**

The player should not be following one enormous pre-written campaign. Instead, the game should generate a world, populate it with characters and conflicts, and allow the player's decisions and the underlying systems to create the story.

---

# 2. CORE DESIGN PHILOSOPHY

## 2.1 The game itself is the Game Master

Do **not** build the runtime around an LLM acting as a Dungeon Master.

The game must be capable of generating and resolving gameplay using deterministic systems.

AI is a development tool, not a runtime dependency.

The core game must work without Gemini, OpenAI, Claude, any LLM, internet connectivity, or external AI services.

The target architecture is:

```text
Seed
 ↓
Procedural Generation
 ↓
Game State
 ↓
Rules
 ↓
Player Action
 ↓
System Resolution
 ↓
Consequence
 ↓
Changed World State
 ↓
New Events
```

---

# 3. PLAYER EXPERIENCE

The default experience should be:

```text
NEW CAMPAIGN
      ↓
Random seed generated automatically
      ↓
World generated
      ↓
Character creation
      ↓
Adventure begins
```

The player should **not** be asked to manually enter a seed during normal play.

The seed is an internal identifier for the campaign.

Advanced seed functionality may later allow:

- Viewing a campaign seed.
- Copying a seed.
- Sharing a seed.
- Importing a seed.
- Daily seeds.
- Challenge seeds.

These are secondary features.

---

# 4. THE CORE LOOP

```text
NEW CAMPAIGN
      ↓
GENERATE SEED
      ↓
GENERATE WORLD
      ↓
CREATE CHARACTER
      ↓
EXPLORE
      ↓
ENCOUNTER
      ↓
CHOOSE ACTION
      ↓
ROLL / RESOLVE
      ↓
CONSEQUENCE
      ↓
WORLD STATE CHANGES
      ↓
QUEST / EVENT / ENCOUNTER
      ↓
EXPLORE
      ↓
...
```

The game should eventually support:

```text
Explore
→ Discover
→ Decide
→ Risk
→ Resolve
→ Consequence
→ Progress
→ Explore again
```

---

# 5. DESIGN PILLARS

## Procedural First

Every campaign begins from a generated seed. The same seed must reproduce the same initial world. Different seeds should produce meaningful variation.

Procedural generation should prioritize **coherence over randomness**.

## Systemic Rather Than Scripted

Systems should interact:

```text
World
  ↕
NPCs + Factions
  ↕
Quests + Events
  ↕
Player
```

Stories should emerge from gameplay systems.

## Player Agency

The player should have meaningful decisions and contextual actions.

Examples:

```text
NPC
├── Talk
├── Persuade
├── Intimidate
├── Steal
└── Attack
```

```text
Chest
├── Open
├── Inspect
├── Lockpick
└── Break
```

## Consequences

Actions must matter. Stealing, killing, helping, lying, abandoning quests and similar decisions should be capable of changing the world.

## Replayability

Variation should exist at multiple levels:

```text
World
Regions
Locations
NPCs
Factions
Quests
Enemies
Items
Encounters
Events
Relationships
```

## Tabletop Feeling

The game should communicate RPG rules through:

- Character statistics.
- Dice.
- Modifiers.
- Risk.
- Chance.
- Abilities.
- Equipment.
- Progression.
- Consequences.

## Atmosphere

The visual identity should be pixel-art fantasy: atmospheric, readable, tactile, slightly mysterious, medieval fantasy, and polished without becoming excessively cinematic.

---

# 6. TECHNICAL PRINCIPLES

The game should be designed around a **platform-agnostic core**.

Conceptually:

```text
UI / Renderer
      ↓
Game Engine
      ↓
Procedural Systems
      ↓
Persistence
```

Game logic must not depend on the browser UI.

The browser is the first platform, not necessarily the final platform.

The core should eventually be portable to a desktop wrapper such as Tauri or Electron without requiring a rewrite.

---

# 7. RECOMMENDED ARCHITECTURE

Target architecture:

```text
src/
├── engine/
├── generation/
├── world/
├── characters/
├── npcs/
├── factions/
├── quests/
├── encounters/
├── combat/
├── dice/
├── items/
├── persistence/
├── ui/
└── utils/
```

This is a target architecture, not a requirement to create empty folders immediately.

Introduce systems when they are actually needed.

---

# 8. GAME STATE

Create a central, explicit GameState.

Conceptually:

```ts
GameState {
  campaign
  seed
  player
  world
  npcs
  factions
  quests
  encounters
  combat
  inventory
  clock
  history
}
```

GameState should be:

- serializable,
- deterministic where appropriate,
- testable,
- explicit,
- independent from rendering.

The renderer should never be the source of truth.

---

# 9. SEED SYSTEM

Every new campaign automatically receives a random seed.

```ts
const seed = generateCampaignSeed();
const world = generateWorld(seed);
```

The seed must be persisted with the campaign.

The same seed should produce the same initial generation.

Do not use uncontrolled `Math.random()` throughout the game.

Use a seeded RNG abstraction.

Where useful, derive deterministic random streams from:

```text
campaign seed
+
system identifier
+
entity identifier
+
event identifier
```

This improves reproducibility and debugging.

---

# 10. PROCEDURAL WORLD GENERATION

The world generator should eventually create:

### World
- Kingdoms.
- Regions.
- Political areas.
- Climate zones.

### Geography
- Mountains.
- Forests.
- Rivers.
- Lakes.
- Plains.
- Roads.
- Coastlines.

### Settlements
- Cities.
- Villages.
- Camps.
- Outposts.

### Points of Interest
- Ruins.
- Caves.
- Mines.
- Temples.
- Towers.
- Dungeons.
- Shrines.
- Hidden locations.

Generation should use constraints.

Examples:

- Rivers flow from high terrain.
- Roads connect meaningful settlements.
- Settlements have logical access to resources.
- Biomes should have coherent neighbours.
- Dungeons should be reachable.
- Important quest locations should be accessible.

---

# 11. CHARACTER SYSTEM

The player character should have persistent RPG data.

Initial MVP can remain simple.

Potential systems:

- Name.
- Origin.
- Archetype.
- Attributes.
- Skills.
- Health.
- Abilities.
- Equipment.
- XP.
- Level.
- Status effects.

Do not overbuild classes before the core loop works.

---

# 12. ACTION SYSTEM

Actions are structured game operations.

```ts
Action {
  type: "ATTACK"
  actorId: "player"
  targetId: "guard_01"
}
```

The engine validates:

```text
Can this action happen?
        ↓
What rules apply?
        ↓
Is a roll required?
        ↓
Resolve result
        ↓
Apply consequences
        ↓
Update GameState
```

This prevents the conversational-loop problems discovered in the original AI prototype.

For example, if the player attacks a guard:

```text
ACTION = ATTACK
TARGET = GUARD

combat.active = true
guard.hostile = true
```

The system must never return to a previous conversation state simply because a narrative layer misunderstood the player's intent.

---

# 13. FREEFORM INPUT

The game may support natural-language input.

However, the parser should first attempt to map text to structured actions.

Examples:

```text
"I attack the guard."
→ ATTACK / guard
```

```text
"I try to steal the merchant's purse."
→ STEAL / merchant / purse
```

```text
"I hide behind the door."
→ HIDE / door
```

Use deterministic parsing and contextual intent recognition where possible.

If a future LLM-assisted parser is introduced, it must remain optional and must output structured actions rather than directly modifying GameState.

---

# 14. QUEST SYSTEM

Quests should be generated from reusable structures.

A quest may contain:

```text
ID
Title
Description
Objectives
Conditions
Dependencies
Branches
Rewards
Failure States
Hidden Variables
State
```

Possible states:

```text
UNKNOWN
AVAILABLE
ACCEPTED
IN_PROGRESS
COMPLETED
FAILED
ABANDONED
```

Different choices should create different consequences.

---

# 15. EVENT SYSTEM

Events are world-level occurrences.

Examples:

- NPC disappears.
- Merchant caravan arrives.
- Faction attacks settlement.
- Storm begins.
- Festival starts.
- Bandits appear.
- Quest deadline approaches.
- NPC changes location.

Events should have:

```text
Trigger
Conditions
Effects
Duration
Consequences
```

Events should be able to modify world state.

---

# 16. NPC SYSTEM

NPCs are persistent entities.

They should eventually have:

```text
Identity
Location
Faction
Personality
Goals
Mood
Relationships
Knowledge
Memory
Inventory
Schedule
Status
```

NPCs should not be simple dialogue generators.

---

# 17. FACTION SYSTEM

Factions should eventually have:

- Identity.
- Goals.
- Territory.
- Resources.
- Reputation.
- Relationships.
- Alliances.
- Conflicts.
- Influence.

Player actions can modify faction relationships.

---

# 18. COMBAT SYSTEM

Combat should be deterministic and turn-based for the initial implementation.

```text
Combat Start
 ↓
Initiative
 ↓
Player Turn
 ↓
Action
 ↓
Roll
 ↓
Resolve
 ↓
Enemy Turn
 ↓
Resolve
 ↓
Repeat
```

Initial combat should remain small.

Do not build dozens of abilities before the basic loop is fun.

---

# 19. DICE SYSTEM

Dice are a core part of the game's identity.

Initial dice:

- d4
- d6
- d8
- d10
- d12
- d20
- d100

The engine calculates the result first.

```ts
const result = rollD20(modifier);
```

The renderer then displays it.

The visual animation must never determine the result.

### Visual goals

- Physical-looking movement.
- Rotation.
- Bounce.
- Collision.
- Settling.
- Clear number display.
- Strong feedback.
- Good sound design.

Do not sacrifice reliability for advanced physics.

If an earlier dice implementation feels better, restore it before attempting a more complex simulation.

---

# 20. ITEMS & ECONOMY

Items should be data-driven.

Potential categories:

- Weapons.
- Armour.
- Consumables.
- Tools.
- Quest items.
- Rare items.
- Treasure.

Inventory should support:

- Acquire.
- Equip.
- Unequip.
- Use.
- Drop.
- Stack.
- Trade.

Economy can later include:

- Gold.
- Shops.
- Prices.
- Buying.
- Selling.
- Loot generation.

---

# 21. EXPLORATION

The world should support:

- Travel.
- Location discovery.
- Time progression.
- Day/night.
- Weather.
- Random encounters.
- Environmental events.
- NPC schedules.

Travel should potentially advance world time.

The world should not be frozen while the player moves through it.

---

# 22. WORLD SIMULATION

The long-term objective is an evolving world.

For example:

```text
Day 1
Merchant arrives.

Day 2
Merchant disappears.

Day 3
Player investigates.

Day 4
Faction begins searching.

Day 5
Player returns.

World state is different.
```

The simulation should be lightweight and deterministic.

Do not simulate unnecessary details. Only simulate systems that create meaningful gameplay.

---

# 23. VISUAL DIRECTION

The visual identity should be:

**Pixel-art fantasy RPG with modern interface polish.**

Important visual areas:

- Character creation.
- Main game view.
- Dialogue.
- Quest journal.
- Character sheet.
- Inventory.
- Map.
- Combat.
- Dice.
- Notifications.
- World events.

Use animation selectively.

The game is primarily systemic and information driven, so animations should reinforce important actions rather than exist everywhere.

---

# 24. LANGUAGE

The primary player-facing language should initially be:

**Spanish**

Architecture should make future localization possible.

Potential future languages:

- English.
- Spanish.
- Others.

Do not hard-code large amounts of UI copy directly into components.

---

# 25. SAVE SYSTEM

Campaigns should be persistent.

A save should contain enough information to restore:

- Seed.
- Player.
- World state.
- NPC states.
- Faction states.
- Quest states.
- Inventory.
- Progression.
- Time.
- Relevant history.

The game should support:

```text
New Campaign
Load Campaign
Continue
Delete Campaign
```

Advanced future functionality:

```text
Export Campaign
Import Campaign
Share Seed
```

---

# 26. TESTING

Procedural games require strong validation.

Important tests:

### Determinism

```text
Seed A
→ World A

Seed A again
→ identical World A
```

### Variation

```text
Seed A
≠
Seed B
```

### Traversability

Generated important locations must be reachable.

### Quest validity

Generated quests must have valid objectives and reachable states.

### State transitions

Actions must not create impossible states.

### Persistence

Save/load must preserve game state.

### Stress testing

Eventually generate hundreds or thousands of campaigns automatically.

Search for:

- Broken worlds.
- Impossible quests.
- Missing NPCs.
- Unreachable locations.
- Softlocks.
- Invalid progression.
- Duplicate identifiers.
- Contradictory state.

---

# 27. AI DEVELOPMENT POLICY

AI is encouraged during development.

Use AI for:

- Coding.
- Debugging.
- Refactoring.
- Test generation.
- Procedural algorithm design.
- Tooling.
- Documentation.
- Brainstorming.
- Content schema design.
- Rapid prototyping.

Do not make the runtime dependent on AI.

> **AI-assisted development, not AI-dependent gameplay.**

---

# 28. CLAUDE CODE WORKFLOW

Claude Code is the primary coding assistant.

Before significant work:

1. Inspect the repository.
2. Read `README.md`.
3. Read `design.md`.
4. Check relevant Linear Projects and Issues.
5. Inspect existing implementation.
6. Identify affected systems.
7. Avoid duplicate implementations.

During implementation:

1. Make the smallest coherent change.
2. Preserve working systems.
3. Keep game logic separate from UI.
4. Use deterministic systems.
5. Add tests where appropriate.
6. Avoid unnecessary dependencies.
7. Do not introduce runtime AI without explicit approval.

After implementation:

1. Run tests.
2. Run the application.
3. Manually verify the feature.
4. Check for regressions.
5. Summarize changes.
6. Update Linear.
7. Commit the change.

---

# 29. LINEAR DEVELOPMENT STRUCTURE

Current Projects:

## P0 — Foundation & Game Engine
**Priority:** Urgent  
**Status:** In Progress

## P1 — Procedural World Generation
**Priority:** Urgent  
**Status:** Planned

## P2 — Player & RPG Systems
**Priority:** Urgent  
**Status:** Planned

## P3 — Actions & Player Agency
**Priority:** Urgent  
**Status:** Planned

## P4 — Quests & Dynamic Events
**Priority:** Urgent  
**Status:** Planned

## P5 — NPCs & Factions
**Priority:** High  
**Status:** Planned

## P6 — Combat & Enemy Systems
**Priority:** High  
**Status:** Planned

## P7 — Dice & Tabletop System
**Priority:** High  
**Status:** Planned

## P8 — Items, Inventory & Economy
**Priority:** Medium  
**Status:** Planned

## P9 — Exploration & World Simulation
**Priority:** Medium  
**Status:** Planned

## P10 — Visual Experience & UI
**Priority:** Medium  
**Status:** Planned

## P11 — Audio & Atmosphere
**Priority:** Low  
**Status:** Planned

## P12 — Replayability & Campaign Sharing
**Priority:** Low  
**Status:** Planned

## P13 — QA, Balancing & Procedural Validation
**Priority:** Urgent  
**Status:** In Progress

---

# 30. DEVELOPMENT MILESTONES

## M1 — Foundation

The engine exists.

```text
Seed
 ↓
GameState
 ↓
Save
 ↓
Load
```

## M2 — Procedural Adventure

A seed creates a playable adventure.

```text
Seed
 ↓
World
 ↓
Character
 ↓
Quest
 ↓
Encounter
 ↓
Resolution
```

## M3 — Systemic RPG

The world reacts.

```text
Player
 ↓
Actions
 ↓
NPCs / Factions
 ↓
Quests
 ↓
Consequences
 ↓
World State
```

## M4 — RPG Gameplay

The game has a complete RPG gameplay loop.

Includes:

- Combat.
- Dice.
- Items.
- Progression.
- Loot.

## M5 — World & Presentation

The game becomes a polished experience.

Includes:

- Exploration.
- World simulation.
- Pixel-art UI.
- Animation.
- Audio.

## M6 — Replayability

The game becomes highly replayable.

Includes:

- Multiple campaigns.
- Seeds.
- Seed sharing.
- Daily seeds.
- Challenge seeds.

---

# 31. MVP DEFINITION

Do **not** attempt to build the entire roadmap before calling the game an MVP.

The first MVP should be deliberately small.

Target:

- Automatic campaign seed.
- One small region.
- One settlement.
- A small number of NPCs.
- A few enemies.
- Basic character creation.
- Basic stats.
- Basic exploration.
- Basic actions.
- A small number of procedural quests.
- One dungeon or dangerous location.
- Basic combat.
- d20 system.
- Basic loot.
- Basic progression.
- Save/load.
- Spanish UI.
- Functional pixel-art-inspired interface.

The MVP is successful when:

> **A player can start a random campaign, play a short adventure from beginning to end, make meaningful decisions, experience consequences, and save the campaign without any runtime AI or external API.**

---

# 32. DEVELOPMENT ORDER

Recommended order:

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

QA, testing and balancing happen continuously.

Do not rigidly follow the order if a dependency or prototype requires a different sequence.

---

# 33. IMPLEMENTATION PHILOSOPHY

Do not over-engineer.

Prefer:

```text
Simple
→ Working
→ Tested
→ Expandable
```

over:

```text
Complex
→ Abstract
→ Flexible
→ Unused
```

Build vertically when possible.

A small complete gameplay loop is more valuable than ten disconnected systems.

---

# 34. FIRST DEVELOPMENT TARGET

The first meaningful target is:

> **First Playable Procedural Campaign**

The player should be able to:

```text
Open game
 ↓
New Campaign
 ↓
Automatic seed generated
 ↓
World generated
 ↓
Create character
 ↓
Enter starting location
 ↓
Explore
 ↓
Meet NPC
 ↓
Receive quest
 ↓
Choose action
 ↓
Resolve action
 ↓
Encounter danger
 ↓
Roll dice
 ↓
Fight / escape / interact
 ↓
Receive consequence
 ↓
Gain XP / loot
 ↓
World state changes
 ↓
Save
 ↓
Load
```

If this works, Aethelgard has its core.

Everything after that is expansion, depth and polish.

---

# 35. FINAL PRODUCT NORTH STAR

The final game should make a player say:

> **"I have no idea what is going to happen in this world."**

And after a session:

> **"You have to hear what happened in my campaign."**

The story should emerge from:

**the player + the rules + the generated world + the consequences.**

Not from a fixed script.

Not from an LLM pretending to be a Game Master.

From the game itself.

---

# IMPORTANT DEVELOPMENT RULE

When making a decision about a new feature, ask:

1. Does this increase player agency?
2. Does this create meaningful systemic interaction?
3. Does this improve replayability?
4. Does this support the procedural world?
5. Can this work without runtime AI?
6. Does this make the game more fun?
7. Is it necessary now?

If the answer to the last question is **no**, consider postponing it.

The goal is not to build the biggest RPG possible.

The goal is to build a **small, coherent systemic RPG first — and then discover how far the systems can go.**
