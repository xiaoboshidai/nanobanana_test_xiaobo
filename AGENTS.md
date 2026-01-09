# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router routes, layouts, and pages.
- `components/`: shared UI and feature components. `components/ui/` contains shadcn/ui primitives—treat as vendor code and edit only when upgrading.
- `hooks/`: reusable React hooks (e.g., `use-toast.ts`).
- `lib/`: shared non-UI utilities (e.g., `lib/utils.ts`).
- `public/`: static assets served as-is (icons, images, placeholders).
- `styles/`: legacy/global styles (prefer `app/globals.css` unless refactoring).

As the project grows, group by domain (e.g., `components/editor/`, `lib/image/`) instead of adding broad “utils” buckets.

## Build, Test, and Development Commands

This repo uses pnpm (see `pnpm-lock.yaml`):

- `pnpm install`: install dependencies.
- `pnpm dev`: run the local dev server (typically `http://localhost:3000`).
- `pnpm build`: create a production build.
- `pnpm start`: run the production server (requires `pnpm build` first).
- `pnpm lint`: run linting (`eslint .`).

## Coding Style & Naming Conventions

- Language: TypeScript + React; prefer small, focused components and named exports.
- Indentation: 2 spaces; keep formatting consistent within a file.
- Filenames: components use `kebab-case.tsx` (e.g., `editor-section.tsx`); hooks use `use-*.ts`.
- Styling: Tailwind CSS is the default; keep class strings readable (group related utilities).

Formatting is not enforced yet. If you add Prettier/ESLint configs, keep them repo-wide and update this document with the exact commands.

## Testing Guidelines

A test runner is not configured yet. If adding tests, prefer Vitest or Jest + React Testing Library.

- Location: `tests/` (mirror `app/`, `components/`, `lib/` where practical).
- Naming: `*.test.ts` / `*.test.tsx`.
- Keep tests deterministic; mock network and time where needed.

Expose tests via `pnpm test` once added.

## Commit & Pull Request Guidelines

Git history may be absent in this folder. Use Conventional Commits where possible:
`feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`.

PRs should include: a clear problem statement, summary of changes, linked issues, screenshots/GIFs for UI changes, and commands run (e.g., `pnpm lint`, `pnpm build`).

## Security & Configuration

- Put secrets in `.env.local`; never commit credentials.
- Use `NEXT_PUBLIC_*` only for values that are safe to expose in the browser.
