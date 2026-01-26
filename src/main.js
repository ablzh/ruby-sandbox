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
let rubyVM = null;

async function initRuby() {
  try {
    const response = await fetch(rubyWasmUrl);
    if (!response.ok) {
      throw new Error(`Failed to load Ruby WASM: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const module = await WebAssembly.compile(buffer);
    const { vm } = await DefaultRubyVM(module);
    
    rubyVM = vm;
    outputDiv.innerHTML = '<span style="color: #666;">Ruby VM Ready. Press Play to run.</span>';
  } catch (e) {
    console.error(e);
    outputDiv.innerText = "Error loading Ruby VM: " + e.message;
  }
}

initRuby();

// 4. Play Button Logic
document.getElementById('btn-play').addEventListener('click', async () => {
  if (!rubyVM) {
    alert("Ruby VM is still loading...");
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
