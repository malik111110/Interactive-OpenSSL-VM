pub fn encrypt(_data: &[u8], _key: &[u8]) -> Vec<u8> {
    Vec::new()
}

pub fn decrypt(_data: &[u8], _key: &[u8]) -> Vec<u8> {
    Vec::new()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_aes_placeholder() {
        let key = b"secretkey";
        let data = b"hello";
        let enc = encrypt(data, key);
        let dec = decrypt(&enc, key);
        assert_eq!(enc.len(), 0);
        assert_eq!(dec.len(), 0);
    }
}
