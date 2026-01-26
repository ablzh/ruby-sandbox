# Ruby Sandbox (WebAssembly)

This project is under active development; the README will be updated as the project evolves. 
Inspired by [Ken H. Burres III's Python Sandbox Turtle Mode](https://pythonsandbox.com/), I wanted to build a similar experience for Ruby. Before diving into the "turtle" implementation, my primary focus is on establishing a solid Ruby sandbox environment.

A single-page Ruby sandbox environment using Monaco Editor and Ruby WASM (WebAssembly).

## Architecture
- **Vite**: Bundler and dev server.
- **Monaco Editor**: Code editing experience.
- **@ruby/wasm-wasi**: Ruby runtime in the browser.
