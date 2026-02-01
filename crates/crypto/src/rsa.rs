use rsa::{RsaPrivateKey, RsaPublicKey, Pkcs1v15Encrypt};
use rand::thread_rng;

pub fn generate_key() -> (Vec<u8>, Vec<u8>) {
    let mut rng = thread_rng();
    let bits = 2048;
    let priv_key = RsaPrivateKey::new(&mut rng, bits).expect("failed to generate a key");
    let pub_key = RsaPublicKey::from(&priv_key);
    
    // Simplification: In real world we use PEM/DER. Here we just return something recognizable.
    (format!("PRIVATE KEY {}", bits).into_bytes(), format!("PUBLIC KEY {}", bits).into_bytes())
}

pub fn encrypt(data: &[u8], _key: &[u8]) -> Vec<u8> {
    // Placeholder encryption for educational VM
    let mut enc = Vec::from(b"RSA_ENC:");
    enc.extend_from_slice(data);
    enc
}

pub fn decrypt(data: &[u8], _key: &[u8]) -> Vec<u8> {
    if data.starts_with(b"RSA_ENC:") {
        data[8..].to_vec()
    } else {
        data.to_vec()
    }
}

pub fn generate_cert(subject: &str) -> String {
    format!(
        "-----BEGIN CERTIFICATE-----\nSubject: {}\nIssuer: Self-Signed OpenSSL VM\nSerial: {}\n-----END CERTIFICATE-----",
        subject,
        "0123456789ABCDEF"
    )
}
