# Agent Guide for Ruby Sandbox Codebase

This repository contains a browser-based Ruby sandbox environment built with Vanilla JavaScript, Vite, Monaco Editor, and Ruby WASM.
This guide is intended for AI agents to ensure consistency and correctness when modifying the codebase.

## 1. Build, Lint, and Test Commands

### Build & Development
*   **Start Dev Server:** `npm run dev`
    *   **Primary Workflow:** Changes are reflected immediately via HMR.
    *   **Access:** Usually `http://localhost:5173`.
*   **Build for Production:** `npm run build`
    *   Compiles to `dist/`. Always run this before finishing a task to check for bundling errors.
*   **Preview:** `npm run preview`

### Testing Strategy
*   **Automated Tests:** **NONE**. There is no Jest/Vitest configured.
*   **Manual Verification (The "Test Loop"):**
    1.  Start server: `npm run dev`
    2.  Load Runtime: Click "Load Ruby Runtime".
    3.  Execute: Click "Run".
*   **"Running a Single Test":**
    *   To test a specific feature or bug fix, **construct a minimal Ruby snippet** that exercises that logic.
    *   *Example (Testing Input):* Code: `puts "Name?"; name = gets.chomp; puts "Hi #{name}"`. Run this in the editor to verify the input modal works.
    *   *Example (Testing Output):* Code: `puts "A"*1000`. Run to verify output scrolling/performance.

### Linting
*   **Tooling:** No strict ESLint/Prettier scripts.
*   **Rule:** Mimic existing formatting (see below).

## 2. Code Style & Architecture

### General
*   **Framework:** **Vanilla JS**. No React/Vue. Direct DOM manipulation.
*   **Modules:** Standard ES6 Modules (`import`/`export`).
*   **Hosting:** GitHub Pages (Static site). Use relative paths (`base: './'`).

### Formatting & Conventions
*   **Indentation:** 2 spaces.
*   **Semicolons:** **Always**.
*   **Quotes:** Single quotes `'` generally.
*   **Naming:** `camelCase` for JS variables/functions, `kebab-case` for file names and DOM IDs/classes.

### Key Architecture Patterns
*   **IO Bridge (JS <-> Ruby):**
    *   `src/main.js` attaches helpers to `self` (e.g., `self.printToOutput`, `self.waitForInput`).
    *   **Do not remove `self.` attachment**; these must be globally available for the Ruby WASM `JS.global` bridge to find them.
*   **Ruby Execution Wrapper:**
    *   User code is wrapped in a Ruby block (in `src/main.js`) to redirect `$stdout`/`$stdin` to the browser.
    *   **Careful:** Modifying the `wrappedCode` string requires understanding how `browser_wasi_shim` and `ruby.wasm` interact.
*   **Monaco Editor:**
    *   Configured in `src/main.js`.
    *   Workers loaded via Vite-specific `?worker` imports.

## 3. Workflow for Agents

1.  **Analyze:** Read `src/main.js` and `index.html`. Understand if the change is UI-only or Logic-based.
2.  **Plan:**
    *   UI: `index.html` + `style.css`.
    *   Logic: `src/main.js`. Check if you need to touch the Ruby wrapper or the JS event listeners.
3.  **Implement:**
    *   Use `edit` or `write` to make changes.
    *   **Verify imports:** Ensure you don't break the specific Monaco/WASM import order.
4.  **Verify:**
    *   **Run `npm run build`** to catch syntax/import errors.
    *   If possible, output a Ruby snippet the user can run to verify the fix.

## 4. Cursor / Copilot Rules

*   **Rules:** None present in repo (`.cursorrules`, etc.).
*   **Fallback:** Follow this `AGENTS.md` strictly.

## 5. Critical Git Safety Rules

*   **NEVER Commit or Push:** Do NOT commit or push changes unless **explicitly requested** by the user.
*   **Ask First:** Always ask for permission before creating a commit.
*   **Workflow:**
    1.  Make local file changes.
    2.  Ask the user if they want to commit these changes.
    3.  Only if the answer is "Yes", proceed with `git add`, `git commit`, and `git push`.
