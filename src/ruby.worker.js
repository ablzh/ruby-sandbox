import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser';

let vm = null;

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  if (type === 'init') {
    try {
      const module = payload; // Expecting WebAssembly.Module
      // DefaultRubyVM initializes the VM and WASI
      const { vm: newVm } = await DefaultRubyVM(module);
      vm = newVm;

      // Redirect stdout/stderr to postMessage using 'js' extension
      // We use JS.global.call to invoke postMessage on the worker global scope
      vm.eval(`
        require 'js'
        class JSStdout
          def write(str)
            msg = JS.global[:Object].new
            msg[:type] = "output"
            msg[:text] = str
            JS.global.call(:postMessage, msg)
          end
        end
        $stdout = JSStdout.new
        $stderr = JSStdout.new
      `);

      self.postMessage({ type: 'ready' });
    } catch (e) {
      self.postMessage({ type: 'error', error: e.message });
    }
  } 
  else if (type === 'run') {
    if (!vm) {
      self.postMessage({ type: 'error', error: 'Ruby VM not ready' });
      return;
    }
    
    // Wrap the user's code to catch exceptions and print them to our redirected stderr
    const wrappedCode = `
      begin
        ${payload}
      rescue Exception => e
        puts "Error: #{e.message}"
        puts e.backtrace.join("\n")
      end
    `;

    try {
      vm.eval(wrappedCode);
      self.postMessage({ type: 'finished' });
    } catch (e) {
      self.postMessage({ type: 'error', error: e.message });
    }
  }
};
