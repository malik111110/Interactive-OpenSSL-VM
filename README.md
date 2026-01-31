# 🌌 Interactive OpenSSL VM

![OpenSSL VM Logo](https://img.shields.io/badge/Status-Development-orange?style=for-the-badge)
![Rust](https://img.shields.io/badge/Rust-2021-black?style=for-the-badge&logo=rust)
![WASM](https://img.shields.io/badge/WASM-Ready-blue?style=for-the-badge&logo=webassembly)

An interactive, high-performance Virtual Machine designed for illustrating and executing cryptographic operations using an OpenSSL-inspired architecture. This project brings low-level cryptographic logic to the browser through WebAssembly and a custom Domain Specific Language (DSL).

---

## 🏗 Architecture

The project is structured as a modular Rust workspace:

- **`crates/vm-core`**: The heartbeat of the project. Contains the Stack VM logic, Instruction Set Architecture (ISA), and execution runtime.
- **`crates/crypto`**: A dedicated library for cryptographic primitives (AES, SHA, RSA, PBKDF2).
- **`crates/dsl`**: A custom language subsystem featuring a Lexer, Parser, and Compiler.
- **`wasm/`**: The bridge between Rust and the Web, exposing the VM execution engine to modern browsers.

### Structure Overview

```text
openssl-vm/
├── crates/
│   ├── vm-core/      # VM Runtime & ISA
│   ├── crypto/       # Crypto Primitives
│   └── dsl/          # Language & Compiler
├── wasm/             # WebAssembly Bridge
└── ui/               # Interactive Frontend (Planned)
```

## 🚀 Getting Started

### Prerequisites

- [Rust & Cargo](https://rustup.rs/) (edition 2021)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) (for building the WebAssembly module)

### Build & Run

1. **Clone the repository**:
   ```bash
   git clone git@github.com:malik111110/Interactive-OpenSSL-VM.git
   cd Interactive-OpenSSL-VM
   ```

2. **Run Workspace Tests**:
   ```bash
   cargo test
   ```

3. **Check Workspace Integrity**:
   ```bash
   cargo check
   ```

4. **Build WASM Package**:
   ```bash
   cd wasm
   wasm-pack build --target web
   ```

## 📜 Custom DSL Example

The Interactive OpenSSL VM uses a simple, intuitive syntax for defining operations:

```crypto
PUSH "password123"
HASH SHA256
PUSH "salt_value"
PBKDF2 1000
AES_ENC
HALT
```

## 🛠 Features

- [x] **Stack-based VM Architecture**
- [x] **Custom Cryptographic Instruction Set**
- [x] **WASM Integration** for Browser compatibility
- [ ] **Interactive UI** (Upcoming)
- [ ] **Step-by-step Trace & Verification**

## 🤝 Contributing

We welcome contributions! Please feel free to open issues or submit PRs to enhance the VM's instruction set or cryptographic primitives.

---

*Designed with ❤️ by the Interactive OpenSSL VM Team.*
