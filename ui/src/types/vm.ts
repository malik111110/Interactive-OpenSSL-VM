export type VmStatus = 'idle' | 'running' | 'halted' | 'error';

export interface StackItem {
    id: string;
    value: string;
    type: 'string' | 'hex' | 'number';
}

export interface TraceFrame {
    pc: number;
    op: string;
    fuelConsumed: number;
    timestamp: string;
}

export interface Step {
    pc: number;
    opcode: string;
}

export interface VmState {
    stack: string[];
    pc: number;
    halted: boolean;
    trace: { steps: Step[] };
    error?: string;
}

export interface Instruction {
    op: string;
    desc: string;
    type: 'STACK' | 'CRYPTO' | 'CTRL';
}
