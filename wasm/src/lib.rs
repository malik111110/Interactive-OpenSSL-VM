use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn run_vm(input: &str) -> String {
    format!("Running VM with input: {}", input)
}
