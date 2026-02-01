#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Opcode {
    Push,
    Pop,
    Add,
    Sub,
    Mul,
    Div,
    Hash,
    Md5,
    Sha512,
    AesEnc,
    AesDec,
    RsaGen,
    RsaEnc,
    RsaDec,
    CertGen,
    Halt,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_opcode_equality() {
        assert_eq!(Opcode::Add, Opcode::Add);
        assert_ne!(Opcode::Add, Opcode::Sub);
    }
}
