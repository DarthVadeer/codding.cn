# codding

```
// 央视节目单关键词抓取

function spider() {
  let d
  let count = 0

  try {
    d = JSON.parse(localStorage.d)
  } catch (e) {
    d = {
      noRepeat: {},
      pool: ['http://tv.cctv.com/'],
      result: [],
      err: [],
    }
    console.warn('d parse err')
  }
  
  function loopGet() {
    if (d.pool.length === 0) {
      console.log('抓取完毕')
      console.log(JSON.stringify(d.result))
      return
    }

    // if (++count > 10) return

    const url = d.pool.shift()
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const sHtml = xhr.responseText
          const urls = (sHtml.match(/"http:\/\/tv\.cctv\.com\/lm\/.*?"/g) || []).map(v => v.slice(1, v.length - 1))
          const names = (sHtml.match(/<div class="text"><a href="http:\/\/tv\.cctv\.com\/\d{4}\/\d{2}\/\d{2}\/[^<>]+\.shtml" target="_blank">[^<>]+<\/a><\/div>/gm) || []).map((str) => {
            return str.match(/>([^<>]+)</)[1]
          }).filter(v => v)
          const name = ((sHtml.match(/<title>([^<>]+)<\/title>/) || [])[1] || '').replace('(cctv.com)', '').trim()

          name && !d.pool.includes(name) && d.pool.push(name)
          urls.forEach((item, idx, arr) => {
            if (d.noRepeat[item]) return
            d.noRepeat[item] = true
            d.pool.push(item)
          })

          names.forEach((item) => {
            if (!d.result.includes[item]) {
              d.result.push(item)
            }
          })

          console.log('d.noRepeat.length', Object.keys(d.noRepeat).length,'  d.pool.length', d.pool.length,'  d.result.length', d.result.length, '   ' + url, name)
          localStorage.d = JSON.stringify(d)
        } else {
          console.log('error...')
        }

        loopGet()
      }
    }
  }

  loopGet()
}

spider()
```

```
// 中央9节目单抓取
async function loadData() {
  const re = /http:\/\/tv\.cctv\.com\/\d{4}\/\d{2}\/\d{2}\/\w+\.shtml/
  const seeds = [
    {name: '特别呈现', url: 'http://tv.cctv.com/lm/tbcx/index.shtml?spm=C28340.PVkcgLVeByP5.EDua8fwCN5a7.3',},
    {name: '寰宇视野', url: 'http://tv.cctv.com/lm/hysx/index.shtml?spm=C28340.PVkcgLVeByP5.EDua8fwCN5a7.6',},
    {name: '时代', url: 'http://tv.cctv.com/lm/shidai/index.shtml?spm=C28340.PVkcgLVeByP5.EDua8fwCN5a7.9',},
    {name: '真相', url: 'http://tv.cctv.com/lm/zhenxiang/index.shtml?spm=C28340.PVkcgLVeByP5.EDua8fwCN5a7.12',},
    {name: '发现', url: 'http://tv.cctv.com/lm/faxian/index.shtml?spm=C28340.PVkcgLVeByP5.EDua8fwCN5a7.15',},
    {name: '万象', url: 'http://tv.cctv.com/lm/wanxiang/index.shtml?spm=C28340.PVkcgLVeByP5.EDua8fwCN5a7.18',},
    {name: '自然', url: 'http://tv.cctv.com/lm/ziran/index.shtml?spm=C28340.PVkcgLVeByP5.EDua8fwCN5a7.21',},
    {name: '人文地理', url: 'http://tv.cctv.com/lm/rwdl/index.shtml?spm=C28340.PVkcgLVeByP5.EDua8fwCN5a7.24',},
  ]
  let result = {}
  let count = 0
  // seeds.length = 1
  return

  seeds.forEach(async (seedItem) => {
    result[seedItem.name] = {}

    await new Promise((next) => {
      console.log('------------------------------------------------------------')
      $.get(seedItem.url, async (sHtml) => {
        const imgs = [].slice.call($(sHtml).find('li a > img, dd a > img'))
        console.log('imgs.length', imgs.length)
        // imgs.length = 50
        console.log('%c ' + seedItem.name, 'color: #09f', imgs.length)

        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i]
          const a = img.parentNode
          const desc = img.closest('li, dd').innerText.replace(/\\n/g, '').trim()

          if (!re.test(a.href)) continue

          await new Promise((next2) => {
            $.get(a.href, (sHtml) => {
              const imgs2 = [].slice.call($(sHtml).find('li a > img[lazy], dd a > img[lazy]'))
              console.log('load ', a.href, desc, imgs2.length)

              for (let i = 0; i < imgs2.length; i++) {
                const img2 = imgs2[i]
                const a2 = img2.parentNode
                const desc2 = img2.closest('li, dd').innerText.replace(/\\n/g, '').trim()

                result[seedItem.name][desc] = result[seedItem.name][desc] || []
                result[seedItem.name][desc].push({
                  id: '',
                  title: '',
                  desc: desc2,
                  img: img2.getAttribute('lazy') || '',
                  site: a2.href,
                })
              }

              next2()
            })
          })
        }

        if (++count === seeds.length) {
          console.log(JSON.stringify(result))
        }

        next()
      })
    })
  })
}

loadData()
```