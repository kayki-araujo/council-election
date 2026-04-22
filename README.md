# CAST — Cross-Appointment Slate Tally

> **Cálculo Aprovativo de Seleção de Titulares**  
> A proportional approval voting engine for multi-seat, role-aware elections.

---

## The Problem

Most voting systems answer one question: _who wins?_

They fail when the question is more structured — _who should be President, and who should be Secretary, and who should be Treasurer_ — because they treat every seat as independent. A candidate elected President by plurality may also dominate every other seat, not because they are the best fit for each role, but because they are the most recognizable name.

CAST was designed for deliberative bodies: small councils, executive committees, cooperative boards — any group that needs to elect multiple people into distinct roles simultaneously, fairly, and with workload distribution in mind.

---

## How It Works

CAST is built on [Proportional Approval Voting (PAV)](https://en.wikipedia.org/wiki/Proportional_approval_voting), extended with three additional mechanisms:

### 1. Matrix Ballot

Rather than approving candidates in a flat list, each elector fills a grid: one row per seat, one column per nominee. This produces a per-(seat, nominee) approval signal instead of a per-nominee one. A candidate can be approved for President and disapproved for Secretary on the same ballot.

### 2. Harmonic Tally

Approval scores are weighted using [Harmonic Numbers](https://en.wikipedia.org/wiki/Harmonic_number) — the same weighting that gives PAV its proportionality guarantee. For each ballot, the contribution to an outcome's score is `H(k)`, where `k` is the number of approved nominees in that outcome. Because `H(k)` grows slower than linearly, a faction that already has representation contributes diminishing returns to additional seats. Minorities get representation; majorities don't dominate.

### 3. Priority Tiers

Seats are grouped into priority tiers. The most important seat (e.g. President) is filled first; its result constrains subsequent tiers. Ties at an earlier tier are broken by the score of the next tier down — a cleaner result at Secretary/Treasury can retroactively resolve a tied President race.

### 4. Fair Workload Distribution

The engine enforces a fairness constraint across tiers: no nominee receives a second role until every other eligible nominee has received one. Within equal workload, nominees appointed in the previous tier are deprioritized — a new President waits for everyone else to receive a role before accumulating a second one.

---

## Stack

| Layer     | Technology                                                                   |
| --------- | ---------------------------------------------------------------------------- |
| Framework | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Routing   | [TanStack Router](https://tanstack.com/router)                               |
| State     | [Zustand](https://zustand-demo.pmnd.rs)                                      |
| Styling   | [Tailwind CSS v4](https://tailwindcss.com)                                   |
| Build     | [Vite](https://vitejs.dev)                                                   |

---

## Architecture

```
src/
├── types/
│   ├── charter.ts       # Election configuration (nominees + seats)
│   ├── nominee.ts       # Participant with isElector / isEligible flags
│   ├── seat.ts          # Named role with priority tier
│   └── ballot.ts        # Per-(seat, nominee) approval matrix
│
├── utils/
│   ├── election-computation/
│   │   └── election-computation.ts   # Core algorithm
│   ├── get-harmonic-number/          # Memoized H(n), O(1) after first call
│   ├── generate-cartesian-product/   # Lazy generator for outcome enumeration
│   └── option/                       # Option<T> monad (None | Some<T>)
│
├── stores/
│   └── election-store.ts    # Zustand store (charter + ballots)
│
├── components/
│   ├── ballot-table/        # The voting grid component
│   └── appointment-card/    # Results display per outcome
│
└── pages/
    ├── setup/    # Configure nominees and seats
    ├── vote/     # Sequential per-elector ballot collection
    └── results/  # Computed appointments with tie handling
```

---

## Running Locally

```bash
git clone https://github.com/your-username/cast
cd cast
npm install
npm run dev
```

---

## Concepts

- [Proportional Approval Voting](https://en.wikipedia.org/wiki/Proportional_approval_voting)
- [Harmonic Numbers](https://en.wikipedia.org/wiki/Harmonic_number)
- [Approval Voting](https://en.wikipedia.org/wiki/Approval_voting)
- [Sequential PAV](https://en.wikipedia.org/wiki/Proportional_approval_voting#Sequential_proportional_approval_voting)
