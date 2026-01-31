use thiserror::Error;

#[derive(Error, Debug)]
pub enum VmError {
    #[error("Invalid opcode")]
    InvalidOpcode,
    #[error("Stack underflow")]
    StackUnderflow,
    #[error("Verification failed: {0}")]
    VerificationFailed(String),
}
