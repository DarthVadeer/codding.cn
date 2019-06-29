const fs = require('fs')
const pathArr = fs.readFileSync('./algo/index.html', 'utf-8').match(/\.\/js\/\w+\.js/g).map(str => './algo' + str.slice(1))
pathArr.shift()

let sJs = pathArr.map((path) => {
  return fs.readFileSync(path, 'utf-8')
}).join('\n\n')

const classList = sJs.match(/class \w+/g).map(str => '  ' + str.slice(str.indexOf(' ') + 1))

sJs += `

export default {
${classList.join(',\n')}
}`

// console.log(sJs)
fs.writeFileSync('./src/components/algo/allAlgo.js', sJs)

console.log('succ')