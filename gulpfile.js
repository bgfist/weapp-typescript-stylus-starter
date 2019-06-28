const { create } = require("./gulp/quick-create")
const { wechat } = require("./gulp/wechat-cli")
const { fixNpm } = require("./gulp/fix-npm")

module.exports = {
  create: create,
  wechat: wechat,
  fixnpm: fixNpm
}
