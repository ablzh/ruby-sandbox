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
    *   Check that the Monaco Editor loads.
    *   Check that the Ruby VM initializes (look for "Ruby VM Ready" in the output pane).
    *   Run simple Ruby code (e.g., `puts "test"`) to verify execution.

### Linting & Formatting
*   **Status:** No specific linter (like ESLint) or formatter (like Prettier) is strictly enforced via scripts, but the existing code follows specific conventions.
*   **Ad-hoc Formatting:**
    *   Maintain the existing indentation (2 spaces).
    *   Ensure semicolons are used at the end of statements.

## 2. Code Style Guidelines

Adhere strictly to these conventions to maintain codebase consistency.

### General Philosophy
*   **Vanilla JavaScript:** The project does *not* use a frontend framework like React, Vue, or Angular. It uses direct DOM manipulation (`document.getElementById`, `addEventListener`). Do not introduce framework dependencies unless explicitly requested.
*   **ES Modules:** Use standard ES6+ modules (`import`/`export`).
*   **Modern JS:** Use modern JavaScript features (Async/Await, Arrow Functions, Template Literals).

### Formatting
*   **Indentation:** Use **2 spaces** for indentation. Do not use tabs.
*   **Semicolons:** **Always** use semicolons at the end of statements.
*   **Quotes:** Use single quotes `'` for strings generally, and backticks `` ` `` for template literals.
*   **Braces:** usage of curly braces is standard.
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
    1.  CSS/Style imports.
    2.  Library imports (`monaco-editor`, `@ruby/wasm-wasi`).
    3.  Worker/Asset imports.
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
*   **State Management:** Since there is no framework, manage state in simple variables (e.g., `let rubyVM = null;`) or derive it from the DOM.

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
*   **Initialization:** The Ruby VM is initialized asynchronously. Ensure checks (like `if (!rubyVM)`) exist before trying to execute code.
*   **Execution:** Use `rubyVM.eval(code)`.
*   **Output Capture:** To capture `stdout` from Ruby, wrap the user's code in a block that redirects `$stdout` to a `StringIO` object, as seen in `src/main.js`.

### Monaco Editor
*   **Configuration:** The editor is configured in `src/main.js`. Respect existing settings (theme `vs-dark`, `automaticLayout: true`).
*   **Workers:** Monaco requires worker configuration. Maintain the `MonacoEnvironment` setup.

### CSS / Styling
*   **File:** `src/style.css` contains the global styles.
*   **Methodology:** Standard CSS. Use Flexbox/Grid for layout.
*   **Responsive:** Ensure the layout works on different screen sizes (though primarily desktop-focused for an IDE).

## 3. Workflow for Agents

When making changes:
1.  **Analyze:** Read `index.html` and `src/main.js` to understand the current DOM structure and logic flow.
2.  **Plan:** If adding a UI feature, determine where in the HTML it goes and how `style.css` needs to be updated. If adding logic, check if it belongs in `initRuby` or a new event listener.
3.  **Implement:**
    *   Update `index.html` if adding elements.
    *   Update `src/main.js` for logic.
    *   Update `src/style.css` for visual changes.
4.  **Verify:** Since there are no tests, ensure the code builds (`npm run build`) and logically makes sense. Check for syntax errors.

## 4. Cursor / Copilot Rules

*   (No specific `.cursorrules` or Copilot instructions found in the repository at this time.)
