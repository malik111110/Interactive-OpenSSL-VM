use crate::instruction::Instruction;
use crate::error::VmError;

pub struct Verifier;

impl Verifier {
    pub fn verify(_instructions: &[Instruction]) -> Result<(), VmError> {
        Ok(())
    }
}
