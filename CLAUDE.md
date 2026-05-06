# Project Guidelines

## Response Rules
- Concis. Fără preambul, fără recapitulări, fără explicații nesolicitate.
- Cod direct, nu narațiune despre cod.
- Diff format pentru editări, nu fișiere complete rescrise.
- Fără sycophancy ("Great question!", "Absolutely!", "You're right!").
- Dacă nu știi, spune-o scurt. Nu inventa.
- Un singur bloc de cod per răspuns dacă e posibil.
- Skip confirmări evidente ("Done!", "I've updated the file") — tool output-ul confirmă deja.

## Model Strategy
- Default: Sonnet — acoperă 80-90% din task-uri.
- Opus doar pentru: arhitectură complexă, debugging cross-system, refactoring multi-fișier.
- Haiku pentru: redenumiri, formatare, lookups rapide, task-uri mecanice.
- `opusplan` pentru: plan cu Opus → execuție cu Sonnet automat.

## Effort Levels
- `/effort low` — typo-uri, redenumiri, formatări.
- `/effort medium` — cod standard, teste, refactoring simplu.
- `/effort high` — debugging complex, features noi.
- `max` — doar arhitectură critică (nu persistă între sesiuni).

## Session Hygiene
- `/compact` după fiecare sub-task finalizat.
- Sesiuni scurte, task-uri izolate. O sesiune = un scop.
- Nu repeta context pe care Claude deja îl are.
- Referă fișiere prin cale + line range, nu prin paste.

## Coding Standards
- **Stack**: React 19 + TypeScript strict (ES2020) + Vite 6
- **Linter/Formatter**: Biome 1.9 — rulează `npx @biomejs/biome check --write .` înainte de commit
  - Single quotes, 2 spaces, no semicolons, 80 char line width
  - `noConsoleLog: error` — nu lăsa console.log în cod
  - Accessibility (a11y) rules enforced as errors
- **CSS**: Tailwind CSS 4 + Radix UI + CVA pentru variante
- **State**: Zustand (client) + React Query v5 (server state)
- **API**: Axios cu interceptori + OpenAPI generated types (`yarn generate:api`)
- **Forms**: React Hook Form + Zod validation
- **i18n**: react-i18next — toate string-urile vizibile prin `t()`, nu hardcodate
- **Imports**: Path alias `@/*` → `./src/*`
- **Package manager**: Yarn 1.22
- **No tests configured** — nu genera teste decât dacă se cere explicit
