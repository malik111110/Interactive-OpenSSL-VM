import { useState, useEffect, useCallback } from 'react';
import { vmService } from '../services/vmService';
import type { VmStatus, StackItem, TraceFrame } from '../types/vm';

export const useVm = () => {
    const [stack, setStack] = useState<StackItem[]>([]);
    const [logs, setLogs] = useState<string[]>(['VM Initialized...', 'Ready for input.']);
    const [trace, setTrace] = useState<TraceFrame[]>([]);
    const [pc, setPc] = useState(0);
    const [fuel, setFuel] = useState(100);
    const [status, setStatus] = useState<VmStatus>('idle');
    const [wasmReady, setWasmReady] = useState(false);

    useEffect(() => {
        vmService.initialize()
            .then(() => {
                setWasmReady(true);
                addLog('WASM Engine Loaded.');
            })
            .catch(() => {
                addLog('Error: WASM Engine failed to load.');
            });
    }, []);

    const addLog = useCallback((msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    }, []);

    const execute = useCallback(async (code: string) => {
        if (!wasmReady) {
            addLog('Error: WASM engine not ready.');
            return;
        }

        setStatus('running');
        addLog('Executing program in WASM VM...');

        try {
            const state = vmService.run(code);

            if (state.error) {
                addLog(`VM Error: ${state.error}`);
                setStatus('error');
                return;
            }

            setPc(state.pc);
            setStack(state.stack.map((val, i) => ({
                id: `stack-${i}-${Date.now()}`,
                value: val,
                type: val.startsWith('0x') ? 'hex' : 'string'
            })));

            if (state.trace && state.trace.steps) {
                setTrace(state.trace.steps.map(step => ({
                    pc: step.pc,
                    op: step.opcode,
                    fuelConsumed: 0,
                    timestamp: new Date().toLocaleTimeString()
                })));
            }

            setStatus(state.halted ? 'halted' : 'idle');
            addLog('Execution completed.');

        } catch (err) {
            addLog('Error: Execution failed.');
            setStatus('error');
        }
    }, [wasmReady, addLog]);

    const reset = useCallback(() => {
        setPc(0);
        setFuel(100);
        setStack([]);
        setStatus('idle');
        setTrace([]);
        addLog('VM Reset.');
    }, [addLog]);

    return {
        stack,
        logs,
        trace,
        pc,
        fuel,
        status,
        wasmReady,
        execute,
        reset,
        addLog
    };
};
