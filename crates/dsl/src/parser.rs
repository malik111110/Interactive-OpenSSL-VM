use crate::lexer::Lexer;

pub struct Parser {
    pub lexer: Lexer,
}

impl Parser {
    pub fn new(lexer: Lexer) -> Self {
        Self { lexer }
    }
}
