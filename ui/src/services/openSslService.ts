
export class OpenSslService {
    static MAN_PAGES: Record<string, string> = {
        'openssl': 'OpenSSL - Tool for using the Various Cryptography Components of OpenSSL\'s libcrypto library from the shell.',
        'dgst': 'DGST - message digests. Supported: md5, sha256, sha512. Usage: openssl dgst [-md5|-sha256|-sha512] [data]',
        'enc': 'ENC - symmetric cipher routines. Usage: openssl enc [-e|-d] [-aes-256-cbc] -k [key] [data]',
        'genrsa': 'GENRSA - generates an RSA private key. Usage: openssl genrsa [numbits]',
        'req': 'REQ - PKCS#10 certificate request and certificate generating utility. Usage: openssl req -new -subj "/CN=name"',
        'x509': 'X509 - Certificate display and signing utility. Usage: openssl x509 -req -in [file]'
    };

    /**
     * Translates common OpenSSL commands to the custom VM DSL.
     */
    static translateToDsl(command: string): string {
        let inputData = '';
        let cmdToProcess = command.trim();

        // Handle piping: echo "data" | openssl ...
        if (cmdToProcess.includes('|')) {
            const pipeParts = cmdToProcess.split('|');
            const echoPart = pipeParts[0].trim();
            cmdToProcess = pipeParts[1].trim();

            if (echoPart.startsWith('echo ')) {
                inputData = echoPart.substring(5).trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
            }
        }

        const parts = cmdToProcess.split(/\s+/);
        const sub = parts[1];

        // Ensure we have data either from pipe or from command arguments
        const extractClosingData = (startIndex: number) => {
            if (inputData) return inputData;
            return parts.slice(startIndex).join(' ').replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        };

        if (parts[0] === 'man') {
            return `MANUAL: ${parts[1] || 'openssl'}`;
        }

        if (parts[0] !== 'openssl' && parts[0] !== 'run') {
            return '';
        }

        // Hashing
        if (sub === 'dgst' || sub === 'hash' || sub === 'md5' || sub === 'sha256' || sub === 'sha512') {
            const data = extractClosingData(2);
            let opcode = 'HASH';
            if (parts.includes('-md5') || sub === 'md5') opcode = 'MD5';
            if (parts.includes('-sha512') || sub === 'sha512') opcode = 'SHA512';
            return `PUSH "${data}"\n${opcode}\nHALT`;
        }

        // Symmetric Encryption
        if (sub === 'enc') {
            const kIndex = parts.indexOf('-k');
            const passIndex = parts.indexOf('-pass');
            const key = kIndex !== -1 ? parts[kIndex + 1] : (passIndex !== -1 ? parts[passIndex + 1] : 'default_key');

            const decrypt = parts.includes('-d');
            const data = extractClosingData(kIndex !== -1 ? kIndex + 2 : (passIndex !== -1 ? passIndex + 2 : 2));

            if (decrypt) {
                return `PUSH "${data}"\nPUSH "${key}"\nAES_DEC\nHALT`;
            }
            return `PUSH "${data}"\nPUSH "${key}"\nAES_ENC\nHALT`;
        }

        // RSA
        if (sub === 'genrsa') {
            return `RSA_GEN\nHALT`;
        }

        if (sub === 'rsautl') {
            const decrypt = parts.includes('-decrypt');
            const data = extractClosingData(parts.indexOf('-in') !== -1 ? parts.indexOf('-in') + 2 : 2);
            const key = 'RSA_PRIVATE_KEY';
            if (decrypt) return `PUSH "${data}"\nPUSH "${key}"\nRSA_DEC\nHALT`;
            return `PUSH "${data}"\nPUSH "${key}"\nRSA_ENC\nHALT`;
        }

        // Certificates
        if (sub === 'req' || sub === 'x509') {
            const subjIndex = parts.indexOf('-subj');
            const subject = subjIndex !== -1 ? parts[subjIndex + 1] : '/CN=OpenSSL-VM-User';
            return `PUSH "${subject}"\nCERT_GEN\nHALT`;
        }

        // Just run DSL directly if command is 'run'
        if (parts[0] === 'run') {
            return parts.slice(1).join('\n');
        }

        return '';
    }

    static isHelp(command: string): boolean {
        return ['help', '?', '-h', '--help'].includes(command.toLowerCase());
    }

    static getHelpText(): string {
        return `
Comprehensive OpenSSL VM Help:
  [Hashing]
    openssl dgst [-md5|-sha256|-sha512] "data"
    echo "data" | openssl dgst
  [Symmetric Crypto]
    openssl enc [-e|-d] -k "key" "data"
  [Asymmetric / RSA]
    openssl genrsa 2048
    openssl rsautl -encrypt -in "data"
  [Certificates]
    openssl req -new -subj "/CN=example.com"
  [System]
    man <command>    - Detailed manual pages
    run <dsl>        - Pure VM directives
    clear / reset    - System control
    `.trim();
    }
}
