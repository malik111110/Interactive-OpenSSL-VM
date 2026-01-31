pub fn derive_key(_password: &[u8], _salt: &[u8], _iterations: u32) -> Vec<u8> {
    Vec::new()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pbkdf2_placeholder() {
        let key = derive_key(b"pass", b"salt", 1000);
        assert_eq!(key.len(), 0);
    }
}
