use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Step {
    pub pc: usize,
    pub opcode: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Trace {
    pub steps: Vec<Step>,
}
