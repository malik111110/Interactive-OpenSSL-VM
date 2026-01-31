use vm_core::{Vm, instruction::Instruction, opcode::Opcode};

#[test]
fn test_vm_idempotency() {
    let mut vm = Vm::new();
    let instructions = vec![
        Instruction { opcode: Opcode::Push, operands: vec![1] },
        Instruction { opcode: Opcode::Halt, operands: vec![] },
    ];
    
    // First run
    let result = vm.run(&instructions);
    assert!(result.is_ok());
    
    // State should be resettable or fresh for second run
    let mut vm2 = Vm::new();
    let result2 = vm2.run(&instructions);
    assert!(result2.is_ok());
    
    assert_eq!(vm.stack.len(), vm2.stack.len());
}

#[test]
fn test_multiple_vm_instances() {
    let vm1 = Vm::new();
    let vm2 = Vm::new();
    
    assert_eq!(vm1.pc, vm2.pc);
    assert_eq!(vm1.stack.len(), vm2.stack.len());
}
