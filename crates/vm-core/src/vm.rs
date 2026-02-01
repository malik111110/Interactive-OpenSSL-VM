use crate::instruction::Instruction;
use crate::error::VmError;
use crate::opcode::Opcode;
use crate::trace::{Trace, Step};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct VmState {
    pub stack: Vec<String>,
    pub pc: usize,
    pub halted: bool,
    pub trace: Trace,
}

pub struct Vm {
    pub stack: Vec<Vec<u8>>,
    pub pc: usize,
    pub halted: bool,
    pub trace: Trace,
}

impl Vm {
    pub fn new() -> Self {
        Self {
            stack: Vec::new(),
            pc: 0,
            halted: false,
            trace: Trace::default(),
        }
    }

    pub fn step(&mut self, instruction: &Instruction) -> Result<(), VmError> {
        if self.halted {
            return Ok(());
        }

        self.trace.steps.push(Step {
            pc: self.pc,
            opcode: format!("{:?}", instruction.opcode),
        });

        match instruction.opcode {
            Opcode::Push => {
                self.stack.push(instruction.operands.clone());
            }
            Opcode::Pop => {
                self.stack.pop().ok_or(VmError::StackUnderflow)?;
            }
            Opcode::Hash => {
                let data = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let hashed = crypto::hash::sha256(&data);
                self.stack.push(hashed);
            }
            Opcode::Md5 => {
                let data = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let hashed = crypto::hash::md5(&data);
                self.stack.push(hashed);
            }
            Opcode::Sha512 => {
                let data = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let hashed = crypto::hash::sha512(&data);
                self.stack.push(hashed);
            }
            Opcode::AesEnc => {
                let key = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let mut data = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                
                // Decode hex if input is 0x...
                if data.starts_with(b"0x") {
                    if let Ok(hex_str) = std::str::from_utf8(&data[2..]) {
                        if let Ok(decoded) = hex::decode(hex_str) {
                            data = decoded;
                        }
                    }
                }

                let encrypted = crypto::aes::encrypt(&data, &key);
                self.stack.push(encrypted);
            }
            Opcode::AesDec => {
                let key = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let mut data = self.stack.pop().ok_or(VmError::StackUnderflow)?;

                // Decode hex if input is 0x...
                if data.starts_with(b"0x") {
                    if let Ok(hex_str) = std::str::from_utf8(&data[2..]) {
                        if let Ok(decoded) = hex::decode(hex_str) {
                            data = decoded;
                        }
                    }
                }

                let decrypted = crypto::aes::decrypt(&data, &key);
                self.stack.push(decrypted);
            }
            Opcode::RsaGen => {
                let (priv_key, pub_key) = crypto::rsa::generate_key();
                self.stack.push(priv_key);
                self.stack.push(pub_key);
            }
            Opcode::RsaEnc => {
                let key = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let data = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let encrypted = crypto::rsa::encrypt(&data, &key);
                self.stack.push(encrypted);
            }
            Opcode::RsaDec => {
                let key = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let data = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let decrypted = crypto::rsa::decrypt(&data, &key);
                self.stack.push(decrypted);
            }
            Opcode::CertGen => {
                let subject_bytes = self.stack.pop().ok_or(VmError::StackUnderflow)?;
                let subject = String::from_utf8_lossy(&subject_bytes);
                let cert = crypto::rsa::generate_cert(&subject);
                self.stack.push(cert.into_bytes());
            }
            Opcode::Halt => {
                self.halted = true;
            }
            _ => {
                // Handle remaining opcodes if any
            }
        }

        self.pc += 1;
        Ok(())
    }

    pub fn run(&mut self, instructions: &[Instruction]) -> Result<(), VmError> {
        while self.pc < instructions.len() && !self.halted {
            self.step(&instructions[self.pc])?;
        }
        Ok(())
    }

    pub fn get_state(&self) -> VmState {
        VmState {
            stack: self.stack.iter().map(|s| {
                if let Ok(s) = std::str::from_utf8(s) {
                    s.to_string()
                } else {
                    format!("0x{}", hex::encode(s))
                }
            }).collect(),
            pc: self.pc,
            halted: self.halted,
            trace: self.trace.clone(),
        }
    }
}
