const https = require('https')
const fs = require('fs')

https.get('https://search.cctv.com/ifsearch.php?page=2&qtext=%E9%A9%AC%E6%9C%AA%E9%83%BD&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=1&channel=&pageflag=1&qtext_str=%E9%A9%AC%E6%9C%AA%E9%83%BD', (res) => {
  let data = ''
  res.on('data', (chunk) => {
    console.log(chunk)
    data += chunk
  })
  res.on('end', () => {
    console.log(data)
  })
})
