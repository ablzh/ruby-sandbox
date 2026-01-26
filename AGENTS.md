# Agent Guide for Ruby Sandbox Codebase

This repository contains a browser-based Ruby sandbox environment built with Vanilla JavaScript, Vite, Monaco Editor, and Ruby WASM.
This guide is intended for AI agents and developers to ensure consistency and correctness when modifying the codebase.

## 1. Build, Lint, and Test Commands

### Build & Development
The project uses **Vite** as the build tool and development server.

*   **Install Dependencies:**
    ```bash
    npm install
    ```

*   **Start Development Server:**
    ```bash
    npm run dev
    ```
    *   This starts a local server (usually at `http://localhost:5173`).
    *   It supports Hot Module Replacement (HMR).
    *   **Agent Note:** When you make changes, they are reflected immediately in the browser if the dev server is running.

*   **Build for Production:**
    ```bash
    npm run build
    ```
    *   This compiles assets into the `dist/` directory.
    *   It handles bundling of WASM files and assets.

*   **Preview Production Build:**
    ```bash
    npm run preview
    ```

### Testing
*   **Status:** There is currently **no automated test suite** (e.g., Jest, Vitest) configured in `package.json`.
*   **Manual Verification:**
    *   Since this is a visual sandbox, changes should be verified by running the dev server (`npm run dev`).
    *   **Step 1:** Check that the Monaco Editor loads with the default `puts "hello"` code.
    *   **Step 2:** Click "Load Ruby Runtime" and wait for "Ruby VM Ready".
    *   **Step 3:** Click "Run" and verify "hello" appears in the output pane.

*   **"Running a Single Test":**
    *   To "run a single test" for a specific bug or feature, you must construct a Ruby snippet that reproduces the issue or exercises the feature.
    *   **Example (Testing JSON support):**
        1.  Open the sandbox.
        2.  Enter code: `require 'json'; puts JSON.generate({status: 'ok'})`
        3.  Run and verify output is `{"status":"ok"}`.
    *   If you are fixing a bug in the JS logic (e.g., output capturing), creating a minimal Ruby script that triggers that logic is the "test case".

### Linting & Formatting
*   **Status:** No specific linter (like ESLint) or formatter (like Prettier) is strictly enforced via scripts.
*   **Ad-hoc Formatting:**
    *   Maintain the existing indentation (**2 spaces**).
    *   Ensure **semicolons** are used at the end of statements.
    *   Use **single quotes** for strings generally.

## 2. Code Style Guidelines

Adhere strictly to these conventions to maintain codebase consistency.

### General Philosophy
*   **GitHub Pages Hosting:** The application is hosted on GitHub Pages.
    *   **Static Only:** It must remain a purely static site (HTML/CSS/JS/WASM only). No server-side runtime (Node.js, Python, Ruby) is available.
    *   **Paths:** Ensure all asset paths are relative or handled via Vite's `base: './'` configuration to support deployment at non-root paths (e.g., `username.github.io/repo-name/`). Avoid absolute paths like `/assets/script.js`.
*   **Vanilla JavaScript:** The project does *not* use a frontend framework like React, Vue, or Angular. It uses direct DOM manipulation (`document.getElementById`, `addEventListener`). **Do not introduce framework dependencies.**
*   **ES Modules:** Use standard ES6+ modules (`import`/`export`).
*   **Modern JS:** Use modern JavaScript features (Async/Await, Arrow Functions, Template Literals).

### Formatting
*   **Indentation:** Use **2 spaces** for indentation. Do not use tabs.
*   **Semicolons:** **Always** use semicolons at the end of statements.
*   **Quotes:** Use single quotes `'` for strings generally, and backticks `` ` `` for template literals.
*   **Braces:** Usage of curly braces is standard.
    ```javascript
    if (condition) {
      // ...
    } else {
      // ...
    }
    ```

### Naming Conventions
*   **Variables & Functions:** Use `camelCase`.
    *   `const editorContainer = ...`
    *   `async function initRuby() { ... }`
*   **DOM IDs/Classes:** Use `kebab-case` for HTML IDs and classes.
    *   ID: `editor-pane`, `btn-play`
    *   Class: `nav-brand`, `full-width`
*   **Files:** Use `kebab-case` or `lowerCase` (e.g., `main.js`, `style.css`).

### Imports
*   **Order:**
    1.  CSS/Style imports (`import '../style.css';`).
    2.  Library imports (`monaco-editor`, `@ruby/wasm-wasi`).
    3.  Worker/Asset imports (using `?worker` or `?url` suffixes).
*   **Example:**
    ```javascript
    import '../style.css';
    import * as monaco from 'monaco-editor';
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    ```

### DOM Manipulation
*   **Element Selection:** Prefer `document.getElementById('id')` for performance and clarity on static elements.
*   **Event Listeners:** Attach listeners directly.
    ```javascript
    document.getElementById('btn-play').addEventListener('click', async () => { ... });
    ```
*   **State Management:** Manage state in simple variables (e.g., `let rubyVM = null;`) or derive it from the DOM.

### Error Handling
*   **Async Operations:** Always wrap `await` calls in `try...catch` blocks, especially for network requests (loading WASM) or code execution.
*   **User Feedback:** Display errors in the UI (e.g., the output pane) rather than just `console.error`.
    ```javascript
    try {
      // ... dangerous operation ...
    } catch (e) {
      console.error(e);
      outputDiv.innerText = "Error: " + e.message;
    }
    ```

### Ruby WASM Integration
*   **Initialization:** The Ruby VM is initialized asynchronously via `fetch` and `WebAssembly.compile`.
*   **Safety:** Ensure checks (like `if (!rubyVM)`) exist before trying to execute code.
*   **Execution:** Use `rubyVM.eval(code)`.
*   **Output Capture:** To capture `stdout` from Ruby, wrap the user's code in a block that redirects `$stdout` to a `StringIO` object. See `src/main.js` for the implementation pattern.

### Monaco Editor
*   **Configuration:** The editor is configured in `src/main.js`. Respect existing settings (theme `vs-dark`, `automaticLayout: true`).
*   **Workers:** Monaco requires worker configuration. Maintain the `MonacoEnvironment` setup exactly as is, utilizing Vite's worker import syntax.

## 3. Workflow for Agents

When making changes:
1.  **Analyze:** Read `index.html` and `src/main.js` to understand the current DOM structure and logic flow.
2.  **Plan:**
    *   If adding a UI feature: Determine where in the HTML it goes and how `style.css` needs to be updated.
    *   If adding logic: Check if it belongs in `initRuby` (load time) or a new event listener (runtime).
3.  **Implement:**
    *   Update `index.html` if adding elements.
    *   Update `src/main.js` for logic.
    *   Update `src/style.css` for visual changes.
4.  **Verify:**
    *   Run `npm run build` to ensure no syntax/bundling errors.
    *   Manually verify the change in the browser (or instruct the user to do so).

## 4. Cursor / Copilot Rules

*   **Specific Rules:** No `.cursorrules` or `.github/copilot-instructions.md` found in the repository.
*   **General:** Follow the code style guidelines above strictly.
