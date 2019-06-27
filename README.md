[TOC]

# 我的世界 | By 田小号🎺


## 参考网站

### vue-cli 配置参考

https://cli.vuejs.org/zh/config/

### 简书babel编译

https://www.jianshu.com/p/dd1b7c5b86ed

### eslint 配置

https://cn.eslint.org/docs/user-guide/configuring

### 囧克斯博客

http://json.is/

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