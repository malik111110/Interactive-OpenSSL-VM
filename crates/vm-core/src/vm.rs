use crate::instruction::Instruction;
use crate::error::VmError;

pub struct Vm {
    pub stack: Vec<u8>,
    pub pc: usize,
}

impl Vm {
    pub fn new() -> Self {
        Self {
            stack: Vec::new(),
            pc: 0,
        }
    }

    pub fn run(&mut self, _instructions: &[Instruction]) -> Result<(), VmError> {
        Ok(())
    }
}
