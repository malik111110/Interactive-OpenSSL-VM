// @ts-ignore
import init, { run_vm } from '../../../wasm/pkg/openssl_vm_wasm.js';
import type { VmState } from '../types/vm';

class VmService {
    private wasmReady = false;

    async initialize(): Promise<void> {
        if (this.wasmReady) return;
        try {
            await init();
            this.wasmReady = true;
        } catch (error) {
            console.error('WASM init failed:', error);
            throw error;
        }
    }

    isReady(): boolean {
        return this.wasmReady;
    }

    run(code: string): VmState {
        if (!this.wasmReady) {
            throw new Error('WASM engine not ready');
        }

        try {
            const resultJson = run_vm(code);
            return JSON.parse(resultJson);
        } catch (error) {
            console.error('Execution failed:', error);
            throw error;
        }
    }
}

export const vmService = new VmService();
