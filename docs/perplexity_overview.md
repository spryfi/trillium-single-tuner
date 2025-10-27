---
title: "Perplexity Overview — Trillium Single Tuner"
date: 2025-10-27
tags: [trillium, single-tuner, supabase, docs]
summary: A React-based tool for editing and generating Trillium parse patterns via a user-friendly single-tune UI with Supabase storage.
---

# TL;DR

- Single-tuner UI allows fast, interactive editing and tuning of Trillium parse patterns.
- Project targets data quality engineers or teams maintaining custom Trillium configuration.
- Supabase integration persists pattern history and enables sharing/collaboration.
- Includes built-in pattern validation and workflow helpers.
- Minimal setup required; can run locally with Vite dev server.

# Project Overview

The Trillium Single Tuner is a specialized web application designed for data quality engineers and technical users who need to edit, validate, and generate Trillium parse patterns efficiently[web:2][web:4]. Its goal is to streamline the creation and tuning of Trillium pattern rules, which are critical for maintaining effective data parsing in enterprise environments. By providing an intuitive single-line workflow UI, users can directly interact with parse components, fix parsing errors, and save tuned patterns alongside their metadata for reference and reuse.

The application centers around a robust pattern-editing interface. Users paste problematic parse lines, update components, and generate new patterns in just a few clicks. Pattern history and metadata are stored via Supabase, supporting search, review, and collaboration between team members or across projects[web:19]. This reduces manual configuration overhead while improving pattern accuracy and auditability.

# Key Files & Where They Live

- `SingleTuner.tsx` — Main UI for single-tune editing, input validation, and pattern generation.
- `supabaseClient.ts` — Initializes Supabase client for connecting to backend database and tables.
- `src/utils/` — Utility modules (such as validation or formatting helpers), if present.
- `.env.local` — Store API keys and secrets here; make sure never to commit this file.
- `package.json`, `vite.config.ts` — Standard files for managing dependencies and Vite dev server configuration/build/run tasks.
- `src/components/PatternHistory.tsx` — (if present) Displays list of previous pattern edits.
- `src/components/PatternForm.tsx` — (if present) Handles input, validation, and UI logic for pattern fields.
- `src/hooks/useSupabasePatterns.ts` — (if present) Encapsulates fetching/saving patterns from Supabase table.
- `src/types/index.ts` — (if present) Defines TypeScript types for patterns, user, etc.
- `public/` — Contains static assets, icons, etc.

# How to Run Locally (Developer Quickstart)

1. Clone the repository and install dependencies:
    ```
    git clone [your repo URL]
    cd trillium-single-tuner
    npm install
    ```
2. Create a `.env.local` file for required environment variables:
    ```
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    # (Non-VITE_ prefix secrets for server only, if backend present)
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    ```
3. Start dev server:
    ```
    npm run dev
    ```
   - The Vite dev server defaults to port 8080, will auto-switch to 8081 if busy.
4. Build for production:
    ```
    npm run build
    ```

# How to Use the Single Tuner UI (Quick Workflow)

1. Visit `/single-tuner` route in your browser after starting dev server.
2. Paste a problematic Trillium parse line or input.
3. Adjust and correct individual parse components as needed.
4. Click **Generate Patterns** to produce suggested fixes and new rules.
5. Use options to save pattern history and metadata to Supabase for later retrieval.
6. Copy or download the generated patterns or outputs for further use.

# Supabase Integration

- The project uses Supabase for backend storage of tuned patterns and their metadata[web:19].
- Expected table (from repo clues): `tune7_pattern_library`
    - Guessed columns: `id`, `created_at`, `pattern_text`, `name`, `tags` (others likely based on app features).
- All API and anon keys should live in `.env.local` (never commit).
- Service role key (if present) is for server actions only; **must not be exposed in client or UI**.
- Typical Supabase errors include auth/cors misconfigurations and row type mismatches.

# Debugging & Common Issues

- **ReferenceError: process is not defined** (browser): Fix by guarding with `typeof process !== "undefined"` and using `import.meta.env` for Vite env variables.
- **Button disabled logic**: Check the `disabled` prop on form buttons, `isValidInput` logic, and that required fields are filled.
- **Supabase CORS/Auth failures**: Ensure correct API URLs/keys and check network tab for CORS errors; Supabase dashboard can help verify rules.
- **Service role key leak risk**: Always guard sensitive keys (never expose service role key in front-end).
- **Pattern not saving**: Confirm DB table exists and matches expected columns; check Supabase logs and types.

# Suggested Next Steps

- Wire fetched patterns into state and display in PatternHistory component.
- Create and ship this documentation as `docs/perplexity_overview.md`.
- Remove any service role keys from client `.env.local`.
- Add and document a `.env.local.example` file for onboarding.
- Implement unit tests for the pattern generation workflow.
- Expand docs with more example parse patterns and UI screenshots.

```json
{
  "filepath": "docs/perplexity_overview.md",
  "actions": ["create", "update_readme_if_missing"],
  "summary": "Single-tuner overview and developer quickstart"
}
```
