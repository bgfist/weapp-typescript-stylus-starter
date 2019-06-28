const path = require("path")
const minimist = require("minimist")
const child_process = require("child_process")
const dayjs = require("dayjs")
const chalk = require("chalk")

const distPath = path.resolve(__dirname, "../src")
const cliPath = "/Applications/wechatwebdevtools.app/Contents/MacOS"

const beautifyConsole = cliback => {
  cliback.stdout.on("data", data => {
    let lines = data
      .toString()
      .split(/[\n|\r\n]/)
      .filter(i => i)
    let contents = lines.join("\r\n")
    console.log(chalk.cyan(contents))
  })
  cliback.stderr.on("data", data => {
    let lines = data
      .toString()
      .split(/[\n|\r\n]/)
      .filter(i => i)
    let contents = lines.join("\r\n")
    console.log(chalk.red(contents))
  })
}

// 获取dist环境
const getDistEnv = done => {
  const { isProd, version } = require("../dist/config")
  const env = isProd ? "生产环境" : "测试环境"
  console.log(chalk.green(`[dist环境] ${env} ${version}`))
  done()
}

// 编译
const build = done => {
  const cliback = child_process.spawn("npm", "run build")
  console.log(chalk.green(`[执行脚本] ${cli} ${argsList.join(" ")}`))
  beautifyConsole(cliback)
  cliback.on("exit", done)
}

const wechatCommand = argsList => {
  const cli = path.join(cliPath, "cli")
  const cliback = child_process.spawn(cli, argsList)
  console.log(chalk.green(`[执行脚本] ${cli} ${argsList.join(" ")}`))
  beautifyConsole(cliback)
}

// 微信开发者工具命令行
const wechatwebdevtoolscli = done => {
  const params = minimist(process.argv.slice(2), {
    boolean: ["o", "open", "h", "help"],
    string: ["u", "upload"]
  })

  if (params.help || params.h || (!params.o && !params.open)) {
    usage()
    return done()
  }

  let argvOptions = {}
  argvOptions[argv] = distPath

  if (params.o || params.open) {
    wechatCommand(argvOptions)
    return done()
  }

  const { isProd, version, versionDesc } = require("../dist/config")
  const env = isProd ? "生产环境" : "测试环境"
  const desc = versionDesc ? `${env}: ${versionDesc}` : `${env}: ${dayjs().format("YYYY-MM-DD HH:mm:ss")} 上传`

  argvOptions[argv] = params[key] || `${version}@${distPath}`
  argvOptions["--upload-desc"] = desc
  argvOptions["--upload-info-output"] = path.resolve(__dirname, "../upload.info.json")

  const argvList = []
  for (key in argvOptions) {
    argvList.push(key, argvOptions[key])
  }

  wechatCommand(argvList)
  done()
}

function usage() {
  console.log(`
Usage: gulp wechat [options]

-o,--open 打开微信开发者工具
-u [p],--upload [p] 打包并上传，p表示生产环境，不传为测试环境
-h, --help 打印帮助
`)
}

module.exports = {
  wechat: wechatwebdevtoolscli
}
