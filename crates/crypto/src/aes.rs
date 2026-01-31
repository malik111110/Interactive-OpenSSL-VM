use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes128Gcm, Nonce,
};

pub fn encrypt(data: &[u8], key: &[u8]) -> Vec<u8> {
    let mut key_bytes = [0u8; 16];
    let len = key.len().min(16);
    key_bytes[..len].copy_from_slice(&key[..len]);
    
    let cipher = Aes128Gcm::new_from_slice(&key_bytes).unwrap();
    let nonce = Nonce::from_slice(&[0u8; 12]); // 96 bits for GCM
    cipher.encrypt(nonce, data).unwrap_or_default()
}

pub fn decrypt(data: &[u8], key: &[u8]) -> Vec<u8> {
    let mut key_bytes = [0u8; 16];
    let len = key.len().min(16);
    key_bytes[..len].copy_from_slice(&key[..len]);
    
    let cipher = Aes128Gcm::new_from_slice(&key_bytes).unwrap();
    let nonce = Nonce::from_slice(&[0u8; 12]);
    cipher.decrypt(nonce, data).unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_aes_gcm() {
        let key = b"secretkey1234567";
        let data = b"hello world";
        let enc = encrypt(data, key);
        let dec = decrypt(&enc, key);
        assert_eq!(data, &dec[..]);
    }
}
