# Watch Together

Watch Together is a **mobile-first web app** that helps groups of friends decide what to watch without endless back-and-forth.

Instead of debating in group chats, users join a shared room, answer a few quick preference questions, and swipe on movie options to arrive at a consensus.

This project focuses on **decision-making UX**, not just recommendations.

---

## Problem

Choosing what to watch with friends often takes longer than actually watching something.
Different moods, vague preferences, and social hesitation slow the process down.

Watch Together externalizes the decision:
- No arguing
- No pressure
- Just clear signals and a shared outcome

---

## Core Idea

1. Friends join a room using a shared code
2. Everyone answers a short, vibe-based questionnaire
3. A pool of movies is generated based on group preferences
4. Users swipe left/right on movie cards
5. Movies liked by everyone are surfaced as final matches

---

## Current Scope (v1)

This repository contains **v1**, which focuses on the core group experience.

### Implemented / In Progress
- Mobile-first UI
- Create / join room flow
- Group preference quiz
- Swipe-based movie selection
- Results screen showing common matches

### Intentionally Excluded (for now)
- User accounts / authentication
- Watchlist imports (e.g. Letterboxd)
- Solo recommendation mode
- Advanced recommendation algorithms
- Native mobile app wrapper

These are planned for later iterations once the core flow is validated.

---

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS
- **Backend / State:** TBD (planned: lightweight backend for rooms & sync)
- **Design approach:** Mobile-first, swipe-driven interactions

---

## Design Principles

- Reduce decision fatigue
- Favor speed over precision
- Make preferences implicit, not argumentative
- Optimize for phone usage and casual social settings

---

## Status

🚧 Early development  
Currently setting up core screens and interaction flow.

---

## Future Ideas

- Solo “What should I watch?” mode
- Watchlist support (manual + external imports)
- Better group matching logic
- Native app version

---

## Why This Project

This project is being built as a **learning-focused, portfolio-ready product**, combining:
- Frontend engineering
- Interaction design
- Product thinking
- Real-world social use cases

The goal is to ship something usable first, then iterate.
