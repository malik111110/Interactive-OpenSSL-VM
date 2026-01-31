pub struct Lexer {
    pub input: String,
}

impl Lexer {
    pub fn new(input: String) -> Self {
        Self { input }
    }
}
