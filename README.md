# weapp-typescript-stylus-starter

## Getting Started

```bash
yarn bootstrap
```

然后打开 node_modules/bin/stylus 文件，搜索 `.css`，将第二处匹配改为 `.wxss`，如下

```js
...
out = [basename(file, extname(file)), sourceMap ? '.css.map' : '.wxss'].join('');
...
```

开始开发

```bash
yarn start
```

## Scripts

```bash
./scripts.js -p login # 新建login页面
./scripts.js -c avatar # 新建avatar组件
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
