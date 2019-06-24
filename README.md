# 我的世界 | By 田小号🎺


参考网站

https://cli.vuejs.org/zh/config/ <br>
https://www.jianshu.com/p/dd1b7c5b86ed <br>
https://cli.vuejs.org/zh/config/ <br>
https://jiongks.name/blog/code-review-for-vue-next/ <br>
http://json.is/ <br>

```
// 让低版本IE支持HTML5 DOM 方法
npm install --save core-js
npm install --save core-js/modules/web.dom.iterable
```

```
// babel.config.js
module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es6.array.fill',
      ]
    }]
  ]
}
```

```
// vue.config.js
module.exports = {
  publicPath: './',
  devServer: {
    port: 4567,
    open: true,
  },
  lintOnSave: false
}
```