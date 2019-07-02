# weapp-typescript-stylus-starter

## Getting Started

```bash
npm run bootstrap
```

然后打开 node_modules/bin/stylus 文件，搜索 `.css`，将第二处匹配改为 `.wxss`，如下

```js
...
out = [basename(file, extname(file)), sourceMap ? '.css.map' : '.wxss'].join('');
...
```

装小程序源码依赖包

```bash
cd src
npm i
# 去小程序开发者工具菜单栏上点击 “构建npm”
gulp fixnpm
```

开始开发

```bash
cd ..
npm start
```

## Scripts

```bash
gulp create -p login # 新建login页面
gulp create -c avatar # 新建avatar组件
gulp fixnpm # 修复npm包错误
```

## Snippets

vscode ts snippets:

- `page` 插入 page 模版
- `comp` 插入 component 模版
- `mixin` 插入 behavior 模版

## Caveats

- `component`和`behavior`中直接声明方法，会处理进 methods 选项中
- 类方法尽量不要用箭头函数，因为微信内部会将 this 指向生成的实例
- wxs 模块目前不支持 ts 的写法，只能写 es5

## Todo

- [ ] 所有 api 都在 `./typings/weapp` 文件夹下，之后拟将 lib.wx.api.d.ts 文件的内容分离到相应的 api 类型文件中
- [ ] 补充微信事件接口
- [ ] 将 weapp-redux 包抽离成单独的 npm 包
