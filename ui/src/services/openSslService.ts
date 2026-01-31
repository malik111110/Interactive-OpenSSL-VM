
export class OpenSslService {
    /**
     * Translates common OpenSSL commands to the custom VM DSL.
     * This is a simplified emulator for educational purposes.
     */
    static translateToDsl(command: string): string {
        const parts = command.trim().split(/\s+/);
        if (parts[0] !== 'openssl' && parts[0] !== 'run') {
            return '';
        }

        // Example: openssl hash "hello"
        if (parts[1] === 'dgst' || parts[1] === 'hash') {
            const value = parts.slice(2).join(' ').replace(/^"(.*)"$/, '$1');
            return `PUSH "${value}"\nHASH\nHALT`;
        }

        // Example: openssl enc -aes-256-cbc -k "mykey" "data"
        if (parts[1] === 'enc') {
            const kIndex = parts.indexOf('-k');
            const key = kIndex !== -1 ? parts[kIndex + 1] : 'default';
            const data = parts[parts.length - 1];
            return `PUSH "${data}"\nPUSH "${key}"\nAES_ENC\nHALT`;
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
Available commands:
  openssl dgst "data"           - Computes SHA256 of data
  openssl enc -k "key" "data"   - Encrypts data using AES
  run <DSL_CODE>                - Executes custom VM DSL
  clear                         - Clears the terminal
  reset                         - Resets the virtual machine
  help                          - Shows this help message
    `.trim();
    }
}
