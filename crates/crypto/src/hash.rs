use sha2::{Sha256, Digest};

pub fn sha256(data: &[u8]) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(data);
    hasher.finalize().to_vec()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sha256_placeholder() {
        let result = sha256(b"hello");
        assert_eq!(result.len(), 0); // Placeholder returns empty vec
    }
}
