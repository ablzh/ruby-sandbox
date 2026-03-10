# [Ruby Sandbox (WebAssembly)](https://ablzh.github.io/ruby-sandbox/)


![Screenshot 2026-03-10 at 19 54 15](https://github.com/user-attachments/assets/bc1f58a5-869d-4c2a-984e-04c4e34d67e7)


Visit [the Ruby Sandbox Kanban board.](https://app.fizzy.do/6145540/public/boards/n8HJv8QWDUmwWztYH68YBoZG)
I've made the board public so everyone can see the tasks, plans, and thoughts on the project.

This project is under active development; the README will be updated as the project evolves. 
Inspired by [Ken H. Burres III's Python Sandbox Turtle Mode](https://pythonsandbox.com/), I wanted to build a similar experience for Ruby. Before diving into the "turtle" implementation, my primary focus is on establishing a solid Ruby sandbox environment.

A single-page Ruby sandbox environment using Monaco Editor and Ruby WASM (WebAssembly).

## Local Development

To run this project locally, ensure you have **Node.js** installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ablzh/ruby-sandbox.git
    cd ruby-sandbox
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser. Changes will reload automatically.

4.  **Build for production:**
    ```bash
    npm run build
    ```
    This compiles assets to the `dist/` directory.

## Credits

### Core Stack
- **[Vite](https://vitejs.dev/)**: Bundler and dev server.
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)**: Code editing experience.
- **[@ruby/wasm-wasi](https://github.com/ruby/ruby.wasm)**: Ruby runtime in the browser.

### AI Assistance
This project was built with the assistance of:
- **Agent**: [Opencode CLI](https://opencode.ai/)
- **Model**: Google Gemini 3 Pro / Google Gemini 3 Flash
