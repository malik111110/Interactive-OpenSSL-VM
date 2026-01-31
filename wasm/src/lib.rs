use wasm_bindgen::prelude::*;
use vm_core::Vm;
use dsl::Compiler;

#[wasm_bindgen]
pub fn run_vm(input: &str) -> String {
    let instructions = Compiler::compile(input);
    let mut vm = Vm::new();
    
    match vm.run(&instructions) {
        Ok(_) => {
            let state = vm.get_state();
            serde_json::to_string(&state).unwrap_or_else(|e| format!("{{\"error\": \"Serialization failed: {}\"}}", e))
        }
        Err(e) => format!("{{\"error\": \"VM execution failed: {}\"}}", e),
    }
}

#[wasm_bindgen]
pub fn compile_only(input: &str) -> String {
    let instructions = Compiler::compile(input);
    format!("Compiled {} instructions", instructions.len())
}
