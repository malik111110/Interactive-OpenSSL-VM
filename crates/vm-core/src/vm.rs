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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vm_new() {
        let vm = Vm::new();
        assert_eq!(vm.stack.len(), 0);
        assert_eq!(vm.pc, 0);
    }

    #[test]
    fn test_vm_run_empty() {
        let mut vm = Vm::new();
        let result = vm.run(&[]);
        assert!(result.is_ok());
    }

    #[test]
    fn test_error_display() {
        let err = VmError::StackUnderflow;
        assert_eq!(format!("{}", err), "Stack underflow");
    }
}
