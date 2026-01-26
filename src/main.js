import '../style.css';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/ruby/ruby.contribution';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser';
import rubyWasmUrl from '@ruby/3.3-wasm-wasi/dist/ruby+stdlib.wasm?url';

// 1. Setup Monaco Environment
self.MonacoEnvironment = {
  getWorker: function (_workerId, _label) {
    return new editorWorker();
  }
};

// 2. Initialize Editor
const editorContainer = document.getElementById('editor');
const editor = monaco.editor.create(editorContainer, {
  value: 'puts "hello"',
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
    // Show load button again?
    // initialState.classList.remove('hidden');
  }
}

btnLoadRuby.addEventListener('click', loadRuby);


// 4. Play Button Logic
document.getElementById('btn-play').addEventListener('click', async () => {
  if (!rubyVM) {
    alert("Please load the Ruby Runtime first.");
    return;
  }

  const code = editor.getValue();
  outputDiv.innerText = "Running...";

  // Wrap code to capture stdout
  // We use a simple approach: $stdout = StringIO.new; ...; $stdout.string
  const wrappedCode = `
    require 'stringio'
    $stdout = StringIO.new
    begin
      ${code}
    rescue Exception => e
      puts "Error: #{e.message}"
      puts e.backtrace.join("\n")
    end
    $stdout.string
  `;

  try {
    const result = rubyVM.eval(wrappedCode);
    // result is a RubyValue. toString() gives the inspection.
    // We want the string content.
    const output = result.toString();
    outputDiv.innerText = output;
  } catch (e) {
    outputDiv.innerText = "Execution Error: " + e.message;
  }
});

// 5. Save Button Logic
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

// 6. Eye/Hide Button Logic
const btnEye = document.getElementById('btn-eye');
const outputPane = document.getElementById('output-pane');
const workspace = document.getElementById('workspace');

btnEye.addEventListener('click', () => {
  const isHidden = outputPane.classList.contains('hidden');
  
  if (isHidden) {
    // Show it
    outputPane.classList.remove('hidden');
    workspace.classList.remove('full-width');
    // Eye open icon? Or just keep same icon.
    // Usually "Hide" implies closing.
  } else {
    // Hide it
    outputPane.classList.add('hidden');
    workspace.classList.add('full-width');
  }
  
  // Trigger editor resize
  // automaticLayout handles it, but sometimes a manual trigger helps if transition is instant.
  // With automaticLayout: true, it should work.
});
