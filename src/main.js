import '../style.css';
import { initLayout } from './layout.js';

// Initialize Layout (Navbar, Banner, Footer) before selecting elements
initLayout({ showControls: true });

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser';
import rubyWasmUrl from '@ruby/4.0-wasm-wasi/dist/ruby+stdlib.wasm?url';

// 1. Setup Monaco Environment
self.MonacoEnvironment = {
  getWorker: function (_workerId, _label) {
    return new editorWorker();
  }
};

// 2. Initialize Editor
const editorContainer = document.getElementById('editor');
const editor = monaco.editor.create(editorContainer, {
  value: '# Write your own Ruby Code!\n# Type your code in the editor window.\n# When finished, press the play button to run your code.\n\nputs "Hello, Ruby!"',
  language: 'ruby',
  theme: 'vs-dark',
  automaticLayout: true,
  minimap: { enabled: false },
  fontSize: 14,
  scrollBeyondLastLine: false,
});

// 3. Initialize Ruby VM
const outputDiv = document.getElementById('output');
const btnLoadRuby = document.getElementById('btn-load-ruby');
const btnPlay = document.getElementById('btn-play');
const initialState = document.getElementById('initial-state');
const loadingState = document.getElementById('loading-state');
const progressText = document.getElementById('progress-text');
const inputContainer = document.getElementById('input-container');
const inputField = document.getElementById('input-field');

let rubyVM = null;

async function loadRuby() {
  initialState.classList.add('hidden');
  loadingState.classList.remove('hidden');

  try {
    const response = await fetch(rubyWasmUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to load Ruby WASM: ${response.status} ${response.statusText}`);
    }

    const contentLength = +response.headers.get('Content-Length');
    const reader = response.body.getReader();

    let receivedLength = 0;
    let chunks = [];
    
    while(true) {
      const {done, value} = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;
      
      if (contentLength) {
         const percent = Math.round((receivedLength / contentLength) * 100);
         progressText.innerText = `Downloading Ruby... ${percent}%`;
      } else {
         progressText.innerText = `Downloading Ruby... ${(receivedLength / 1024 / 1024).toFixed(1)} MB`;
      }
    }

    progressText.innerText = 'Compiling WASM...';
    
    let chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for(let chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    const buffer = chunksAll.buffer;
    const module = await WebAssembly.compile(buffer);
    const { vm } = await DefaultRubyVM(module);
    
    rubyVM = vm;
    
    loadingState.classList.add('hidden');
    outputDiv.innerHTML = '<div style="color: #666; padding: 10px;">Ruby VM Ready. Press Play to run.</div>';
    
  } catch (e) {
    console.error(e);
    loadingState.classList.add('hidden');
    outputDiv.innerText = "Error loading Ruby VM: " + e.message;
  }
}

btnLoadRuby.addEventListener('click', loadRuby);


// 4. IO Handling
self.printToOutput = (text) => {
  // Use appendChild for safety and performance
  outputDiv.appendChild(document.createTextNode(text));
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

self.waitForInput = async () => {
  inputContainer.classList.remove('hidden');
  inputField.value = '';
  inputField.focus();

  return new Promise((resolve) => {
    const handler = (e) => {
      if (e.key === 'Enter') {
        inputField.removeEventListener('keydown', handler);
        inputContainer.classList.add('hidden');
        const value = inputField.value;
        // Echo input to output with newline
        self.printToOutput(value + "\n");
        resolve(value);
      }
    };
    inputField.addEventListener('keydown', handler);
  });
};

// 5. Play Button Logic
document.getElementById('btn-play').addEventListener('click', async () => {
  if (!rubyVM) {
    alert("Please load the Ruby Runtime first.");
    return;
  }

  const code = editor.getValue();
  outputDiv.innerText = ""; // Clear output
  btnPlay.disabled = true;

  const wrappedCode = `
    require 'js'

    module Kernel
      def sleep(seconds)
        JS.global[:Promise].new(->(resolve, reject) {
          JS.global.setTimeout(resolve, seconds * 1000)
        }).await
      end
    end

    class BrowserStdout
      def write(str)
        JS.global.printToOutput(str.to_s)
        str.to_s.bytesize
      end
    end

    class BrowserStdin
      def gets
        val = JS.global.waitForInput.await
        val.to_s + "\n"
      end
      
      def readline
        gets
      end
      
      def read
        gets
      end
    end

    $stdout = BrowserStdout.new
    $stderr = BrowserStdout.new
    $stdin = BrowserStdin.new

    begin
      ${code}
    rescue Exception => e
      puts "Error: #{e.message}"
      puts e.backtrace.join("\n")
    end
  `;

  try {
    await rubyVM.evalAsync(wrappedCode);
  } catch (e) {
    console.error(e);
    self.printToOutput("\nExecution Error: " + (e.message || e));
  } finally {
    btnPlay.disabled = false;
  }
});

// 6. Save Button Logic
document.getElementById('btn-save').addEventListener('click', () => {
  const code = editor.getValue();
  const blob = new Blob([code], { type: 'text/x-ruby' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'script.rb';
  a.click();
  URL.revokeObjectURL(url);
});

// 7. Eye/Hide Button Logic
const btnEye = document.getElementById('btn-eye');
const outputPane = document.getElementById('output-pane');
const workspace = document.getElementById('workspace');

btnEye.addEventListener('click', () => {
  const isHidden = outputPane.classList.contains('hidden');
  
  if (isHidden) {
    // Show it
    outputPane.classList.remove('hidden');
    workspace.classList.remove('full-width');
  } else {
    // Hide it
    outputPane.classList.add('hidden');
    workspace.classList.add('full-width');
  }
  
  // automaticLayout handles resize
});
