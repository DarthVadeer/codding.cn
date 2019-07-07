[TOC]

# 我的世界 | By 田小号🎺

炫酷动画

https://github.com/mojs/mojs

进场动画 b<b></b>

https://codepen.io/sol0mka/full/39427561a8a0b15d7896480a7d96d3d1/

https://codepen.io/sol0mka/full/yNOage/

# es6+支持情况

http://kangax.github.io/compat-table/es6/#test-Array.from

17 素材网 <br>
http://www.17sucai.com/pins/tag/5685.html

诡异烟雾 <br>
http://www.17sucai.com/pins/demo-show?id=32677

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

```
// 17素材网，内容抓取代码
async function getData() {
  let result = []

  for (let i = 1; i <= 23; i++) {
    await new Promise((next) => {
      $.get('http://www.17sucai.com/pins/tag/418.html?p=' + i, (str) => {

        $(str).find('.picbox li.item').each((idx, li) => {
          li = $(li)
          result.push({
            href: li.find('.demo-btn').attr('href'),
            text: li.find('.txt').text(),
            img: li.find('.lazy').attr('data-url'),
          })
        })

        next()
      })
    })
    break
  }

  result = result.filter((v) => {
    return (
      v.href &&
      v.img &&
      v.text
    )
  })

  console.log(JSON.stringify(result))
}

getData()

```