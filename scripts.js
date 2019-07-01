#!/usr/bin/env node

const minimist = require("minimist")
const path = require("path")
const fs = require("fs")
const package = require("./package.json")

const srcPath = path.resolve(__dirname, "src")
const pagesPath = path.resolve(srcPath, "pages")
const compsPath = path.resolve(srcPath, "comps")

const transformHyphenToCamelCase = str => {
  return str.replace(/(^|-|_)([a-z])/g, (...args) => args[2].toUpperCase())
}

const genPageJsonContent = () => `{
  "navigationBarTitleText": "${package.name}"
}`

const genCompJsonContent = () => `{
  "component": true,
  "usingComponents": {}
}`

// -----

const genPageTsContent = filename => `import WXPage from "@bgfist/weact"

interface Data {}

class ${transformHyphenToCamelCase(filename)}Page extends WXPage<Data> {
  public data: Data = {}
}

new ${transformHyphenToCamelCase(filename)}Page().init()
`

// -----

const genCompTsContent = filename => `import { WXComponent } from "@bgfist/weact"

interface Properties {}

interface Data {}

class ${transformHyphenToCamelCase(filename)}Comp extends WXComponent<Properties, Data> {
  public properties: Properties = {}

  public data: Data = {}
}

new ${transformHyphenToCamelCase(filename)}Comp().init()
`

// -----

const genWXMLContent = () => `<view></view>`

const genStylusContent = () => ``

const addPathToAppJson = params => {
  const appJsonPath = path.resolve(srcPath, "app.json")
  fs.readFile(appJsonPath, function(err, data) {
    if (err) {
      return console.error(err)
    }
    const dataJson = JSON.parse(data.toString())
    dataJson.pages.push(params)
    const str = JSON.stringify(dataJson, null, 2)
    fs.writeFile(appJsonPath, str, function(err) {
      if (err) {
        console.error(err)
      }
    })
  })
}

const createPage = (parentPath, name) => {
  const destPath = parentPath ? `${parentPath}/${name}` : `${name}`
  const pageDirPath = path.resolve(pagesPath, destPath)
  fs.mkdirSync(pageDirPath, { recursive: true })
  fs.writeFileSync(path.resolve(pageDirPath, name + ".json"), genPageJsonContent())
  fs.writeFileSync(path.resolve(pageDirPath, name + ".ts"), genPageTsContent(name))
  fs.writeFileSync(path.resolve(pageDirPath, name + ".wxml"), genWXMLContent())
  fs.writeFileSync(path.resolve(pageDirPath, name + ".styl"), genStylusContent())

  addPathToAppJson(`pages/${destPath}/${name}`)
}

const createComponent = (parentPath, name) => {
  const destPath = parentPath ? `${parentPath}/${name}` : `${name}`
  const compDirPath = path.resolve(compsPath, destPath)
  fs.mkdirSync(compDirPath, { recursive: true })
  fs.writeFileSync(path.resolve(compDirPath, name + ".json"), genCompJsonContent())
  fs.writeFileSync(path.resolve(compDirPath, name + ".ts"), genCompTsContent(name))
  fs.writeFileSync(path.resolve(compDirPath, name + ".wxml"), genWXMLContent())
  fs.writeFileSync(path.resolve(compDirPath, name + ".styl"), genStylusContent())
}

function main() {
  const options = minimist(process.argv.slice(2), {
    boolean: ["p", "c", "help", "h"]
  })
  const { p, c, help, h, _ } = options

  if (help || h || (!p && !c) || !_.length) {
    return usage()
  }

  let [parentPath, name] = _
  if (!name) {
    name = parentPath
    parentPath = ""
  }

  if (p) {
    return createPage(parentPath, name)
  }

  return createComponent(parentPath, name)
}

function usage() {
  console.log(`
Usage: ./scripts [-p|-c] [path] name [--help|-h]

-p 生成一个页面
-c 生成一个组件
-h, --help 打印帮助
`)
}

main()
