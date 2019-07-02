module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/test/*.test.ts"],
  setupFiles: ["./test/bootstrap.ts", "./src/app.ts"]
}
