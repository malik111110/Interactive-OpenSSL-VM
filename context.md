# Interactive OpenSSL Learning VM (Rust + WASM)

## High-Level Goal

Build a sandboxed virtual machine compiled to WASM, implemented in Rust, preconfigured with OpenSSL cryptographic primitives. The VM runs entirely in the browser and provides an interactive, step-by-step learning experience for cryptography and security concepts.

This is not a full Linux VM. It is a controlled execution environment exposing a curated subset of OpenSSL functionality for education and experimentation.

---

## Core Objectives

* Safe, sandboxed execution of cryptographic operations
* Hands-on learning without local OpenSSL installation
* Deterministic, inspectable execution
* Step-by-step instruction tracing
* Beginner-to-intermediate crypto education

---

## Non-Goals

* No shell access
* No arbitrary native code execution
* No file system beyond in-memory buffers
* No network access
* No full OpenSSL CLI emulation

---

## Architecture Overview

### Layers

1. **UI Layer (Browser)**

   * Interactive editor
   * Step / Run / Reset controls
   * Visual stack + state inspector
   * Guided exercises

2. **WASM Boundary**

   * Strict API surface
   * Deterministic memory layout
   * Serialized inputs / outputs

3. **VM Core (Rust)**

   * Instruction decoder
   * Execution engine
   * Tracing system
   * Error handling

4. **Crypto Backend (OpenSSL)**

   * Rust bindings (openssl crate or minimal FFI)
   * Restricted, audited API usage

---

## VM Execution Model

### VM Type

* Stack-based VM
* Deterministic execution
* Instruction fuel limit

### Core VM State

* Program Counter (PC)
* Operand Stack
* Execution Fuel
* Halt Flag
* Trace Buffer

---

## Instruction Model

### Instruction Categories

#### Stack Operations

* PUSH <value>
* POP
* DUP

#### Control Flow

* JMP <offset>
* JZ <offset>
* HALT

#### Crypto Instructions (Abstracted)

* HASH <algo>
* ENC <cipher>
* DEC <cipher>
* KDF <method>
* SIGN <algo>
* VERIFY <algo>

Crypto instructions operate on stack values and return results onto the stack.

---

## Supported Cryptography (Initial Scope)

### Hashing

* SHA-256
* SHA-512

### Symmetric Encryption

* AES-128-GCM
* AES-256-GCM

### Asymmetric

* RSA (sign/verify only initially)

### Key Derivation

* PBKDF2

---

## Bytecode Format

* 1 byte opcode
* Optional immediate operands
* Little-endian encoding
* Flat byte buffer

Bytecode is validated before execution.

---

## Error Model

* Invalid opcode
* Stack underflow / overflow
* Invalid crypto parameters
* Fuel exhaustion
* Execution halted

Errors halt execution and are returned to the UI in a structured form.

---

## Instruction Tracing

### Trace Frame

Each executed instruction produces a trace frame containing:

* PC
* Opcode
* Stack snapshot (bounded)
* Instruction-specific metadata

Trace frames are stored in a ring buffer and exposed to the UI.

---

## Step-by-Step Execution

### Exposed WASM API

* vm_new(bytecode)
* vm_step()
* vm_run(max_steps)
* vm_reset()
* vm_get_trace()
* vm_get_state()

Each step executes exactly one instruction and returns trace data.

---

## Learning Experience Layer

### Interactive Exercises

* Encrypt and decrypt a message
* Compare hashes
* Derive keys using PBKDF2
* Verify digital signatures

### Guided Mode

* Locked instructions per lesson
* Inline explanations per opcode
* Expected output validation

---

## UI Requirements

* Code editor (bytecode or DSL)
* Console output
* Stack visualization
* Instruction pointer highlight
* Trace timeline

---

## Security Constraints

* No raw OpenSSL pointer exposure
* No user-controlled memory allocation sizes
* All inputs length-checked
* Constant-time primitives where applicable

---

## Tooling

* Rust (stable)
* wasm-bindgen
* wasm-pack
* OpenSSL (via Rust bindings)
* Browser-based UI (framework-agnostic)

---

## Milestones

1. Minimal VM without crypto
2. Bytecode verifier
3. Tracing + step execution
4. WASM compilation
5. Hashing support
6. Symmetric crypto support
7. Interactive lessons
8. UI polish

---

## Long-Term Extensions

* TLS handshake visualization
* Certificate parsing and inspection
* Side-channel discussion mode (educational)
* Custom crypto challenges

---

## Design Philosophy

* Educational > feature-complete
* Deterministic > performant
* Explicit > clever
* Secure by construction

This document serves as the initial context and specification for agents and contributors building the Interactive OpenSSL Learning VM.
Good, this is the point where projects either become sharp tools or abandoned repos with a cool README. Let’s decide like adults who’ve been burned before.

I’ll be opinionated, because ambiguity is how security projects die.

---

## 1. Bytecode vs mini-DSL for user input

Short answer: **both, but not equally**.

Long answer, and this matters:

### Internally: **BYTECODE ONLY**

The VM executes **bytecode**, full stop.
Deterministic, verifiable, bounded, boring. That’s what you want.

### Externally (user-facing): **mini-DSL that compiles to bytecode**

Users do *not* want to write hex opcodes unless they hate themselves.
Learners want intent, not instruction encoding.

So the model is:

```
User DSL  →  DSL Compiler  →  Verified Bytecode  →  VM
```

Why this is the correct tradeoff:

* Bytecode = security boundary
* DSL = usability layer
* You can reject unsafe programs before they ever hit execution
* You can annotate DSL lines with learning explanations

Example DSL:

```
key = pbkdf2("password", "salt", 100000)
cipher = aes256_gcm_encrypt(key, "hello")
hash = sha256(cipher)
```

This compiles into bytecode like a soulless machine should.

Decision locked:
**Mini-DSL for humans, bytecode for the VM.**

---

## 2. Lock the opcode table for crypto ops

This is where you must be ruthless.
No “just one more opcode.” That way lies chaos.

### Design rule

Opcodes describe **intent**, not OpenSSL internals.

Bad:

* `EVP_CIPHER_CTX_NEW`
* `EVP_DigestInit_ex`

Good:

* `HASH_SHA256`
* `AES_GCM_ENC`
* `PBKDF2`

### Proposed opcode table (v1)

#### Stack / VM

* `PUSH_CONST`
* `POP`
* `DUP`
* `HALT`

#### Crypto

* `HASH_SHA256`

* `HASH_SHA512`

* `PBKDF2_HMAC_SHA256`

* `AES_128_GCM_ENC`

* `AES_128_GCM_DEC`

* `AES_256_GCM_ENC`

* `AES_256_GCM_DEC`

* `RSA_SIGN_PSS_SHA256`

* `RSA_VERIFY_PSS_SHA256`

That’s it. No DES. No ECB. No MD5.
If someone complains, congratulations, you’re teaching them something.

Each crypto opcode:

* Pops fixed arguments from stack
* Pushes exactly one result or an error

Decision locked:
**Small, explicit, opinionated opcode set.**

---

## 3. Exact OpenSSL bindings you allow

This is a big one. If you screw this up, the whole “sandbox” story collapses.

### Rule 1: No raw OpenSSL exposure

The VM **never** sees OpenSSL structs or pointers. Ever.

### Rule 2: One Rust wrapper per opcode

Each opcode maps to **one** safe Rust function.

Example:

```
fn aes_256_gcm_encrypt(key, iv, plaintext) -> Result<Ciphertext>
```

Not:

```
EVP_CIPHER_CTX*
```

### Allowed OpenSSL surface (initial)

From OpenSSL, indirectly via Rust:

* EVP digest functions (SHA-256, SHA-512)
* EVP symmetric cipher APIs (AES-GCM only)
* PKCS5_PBKDF2_HMAC
* EVP_PKEY + RSA sign/verify only

Explicitly forbidden:

* Custom cipher modes
* Low-level BN manipulation
* Random device access outside controlled RNG
* Anything stateful across VM executions

Keys, IVs, salts:

* Passed as byte buffers
* Length-checked
* No user-controlled allocation sizes

Decision locked:
**High-level crypto only, wrapped, audited, boring.**

---

## 4. Bytecode verifier spec (this is your credibility)

This is the part most people skip. You won’t.

### When verification happens

* After DSL compilation
* Before VM execution
* Always

No “debug mode” bypass. Ever.

### Verifier responsibilities

#### Structural checks

* Program length < MAX_BYTECODE_SIZE
* Valid opcode values only
* No truncated operands
* PC always lands on instruction boundary

#### Stack safety

* Static stack height analysis
* No underflow possible on any path
* Max stack height < STACK_LIMIT

This alone kills 80% of VM bugs.

#### Control flow

* JMP/JZ targets must be valid instruction offsets
* No jumps into middle of instruction
* No infinite loops without fuel consumption

#### Crypto constraints

* Opcode-specific argument counts enforced
* Key sizes validated statically where possible
* No reuse of sensitive buffers across incompatible ops

#### Fuel model

* Every instruction costs ≥ 1 fuel
* Crypto ops cost more
* Program must terminate or exhaust fuel

If verification fails:

* Execution never starts
* Error returned with precise reason

Decision locked:
**Verifier is mandatory, deterministic, non-optional.**