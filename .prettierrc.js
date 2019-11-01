module.exports = {
  printWidth: 150,
  semi: false,
  singleQuote: false,
  htmlWhitespaceSensitivity: "strict",
  overrides: [
    {
      files: "*.wxml",
      options: {
        parser: "html"
      }
    }
  ]
}
