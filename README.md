# weapp-typescript-stylus-starter

## Getting Started

```bash
npm i
```

然后打开 node_modules/bin/stylus 文件，搜索 `.css`，将第二处匹配改为 `.wxss`，如下

```js
...
out = [basename(file, extname(file)), sourceMap ? '.css.map' : '.wxss'].join('');
...
```

```bash
npm start
```

## Scripts

```bash
./scripts -p login # 新建login页面
./scripts -c avatar # 新建avatar组件
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
