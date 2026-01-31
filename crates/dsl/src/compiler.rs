use vm_core::{Instruction, Opcode};

pub struct Compiler;

impl Compiler {
    pub fn compile(input: &str) -> Vec<Instruction> {
        let mut instructions = Vec::new();
        for line in input.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with("//") {
                continue;
            }

            let parts: Vec<&str> = line.splitn(2, ' ').collect();
            match parts[0].to_uppercase().as_str() {
                "PUSH" => {
                    if parts.len() > 1 {
                        let val = parts[1].trim();
                        // Handle quoted strings
                        let val = if val.starts_with('"') && val.ends_with('"') {
                            &val[1..val.len()-1]
                        } else {
                            val
                        };
                        instructions.push(Instruction {
                            opcode: Opcode::Push,
                            operands: val.as_bytes().to_vec(),
                        });
                    }
                }
                "HASH" => {
                    instructions.push(Instruction {
                        opcode: Opcode::Hash,
                        operands: Vec::new(),
                    });
                }
                "POP" => {
                    instructions.push(Instruction {
                        opcode: Opcode::Pop,
                        operands: Vec::new(),
                    });
                }
                "AES_ENC" => {
                    instructions.push(Instruction {
                        opcode: Opcode::AesEnc,
                        operands: Vec::new(),
                    });
                }
                "HALT" => {
                    instructions.push(Instruction {
                        opcode: Opcode::Halt,
                        operands: Vec::new(),
                    });
                }
                _ => {
                    // Ignore unknown for now or TODO
                }
            }
        }
        instructions
    }
}
