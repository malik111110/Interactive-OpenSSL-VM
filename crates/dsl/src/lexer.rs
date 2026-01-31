pub struct Lexer {
    pub input: String,
}

impl Lexer {
    pub fn new(input: String) -> Self {
        Self { input }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lexer_new() {
        let input = "PUSH 10".to_string();
        let lexer = Lexer::new(input.clone());
        assert_eq!(lexer.input, input);
    }
}
