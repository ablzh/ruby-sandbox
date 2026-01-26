# Ruby Sandbox (WebAssembly)

A single-page Ruby sandbox environment using Monaco Editor and Ruby WASM (WebAssembly).
The Ruby runtime runs entirely in the browser using `@ruby/3.3-wasm-wasi`.

## Features
- **Editor**: Monaco Editor with Ruby syntax highlighting.
- **Runtime**: Ruby 3.3.0 running via WASM.
- **Output**: Redirects Ruby `$stdout` to the output panel.
- **UI**: Dark Slate theme, collapsible output pane.

## Development

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup
1. Clone the repository (or extract files).
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Deployment
To create a production build (e.g., for GitHub Pages):
```bash
npm run build
```
The output will be in the `dist/` directory.

## Deployment to GitHub Pages
1. Push the contents to a GitHub repository.
2. Enable GitHub Pages in Settings > Pages.
3. Select "GitHub Actions" or "Deploy from Branch" (e.g., `main` or `gh-pages`).
   - If using Actions, use the standard "Static HTML" workflow.
   - If using `gh-pages` branch, commit the `dist/` folder content to that branch.

## Architecture
- **Vite**: Bundler and dev server.
- **Monaco Editor**: Code editing experience.
- **@ruby/wasm-wasi**: Ruby runtime in the browser.
