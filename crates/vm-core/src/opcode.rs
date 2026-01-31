#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Opcode {
    Push,
    Pop,
    Add,
    Sub,
    Mul,
    Div,
    Hash,
    AesEnc,
    AesDec,
    Halt,
}
