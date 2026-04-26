export function initLayout({ showControls = false } = {}) {
  const year = new Date().getFullYear();

  const navbarHtml = `
    <nav class="navbar">
      <h1 class="nav-brand">Ruby Sandbox</h1>
      <div class="nav-menu">
        <a href="./index.html">Home</a>
        <a href="./docs.html">Docs</a>
        <a href="./about.html">About Ruby Sandbox</a>
        <a href="./contact.html">Contact</a>
      </div>
    </nav>
  `;

  const footerLeftHtml = showControls ? `
        <button id="btn-play" class="btn-icon btn-play" title="Run Code">
          <!-- Cyan Square with White Triangle -->
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M8 5v14l11-7z" />
          </svg>
        </button>
        <button id="btn-save" class="btn-icon btn-save" title="Save as .rb">
          <!-- Floppy Disk -->
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
            ></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </button>
  ` : '';

  const footerRightHtml = showControls ? `
        <button id="btn-eye" class="btn-icon btn-eye" title="Toggle Output">
          <!-- Eye Icon -->
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
  ` : '';

  const footerHtml = `
    <footer class="footer">
      <div class="footer-left">
        ${footerLeftHtml}
      </div>

      <div class="footer-center">
        &copy; ${year} Artem Blazhievskii. Found a bug?
        <a href="https://github.com/ablzh/ruby-sandbox" target="_blank"
          >Contribute on GitHub</a
        >
      </div>

      <div class="footer-right">
        ${footerRightHtml}
      </div>
    </footer>
  `;

  // Inject into body
  // Order: Navbar -> Banner -> Existing Content -> Footer
  document.body.insertAdjacentHTML('afterbegin', navbarHtml);
  document.body.insertAdjacentHTML('beforeend', footerHtml);
}
