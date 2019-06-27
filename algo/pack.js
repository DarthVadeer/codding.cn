const fs = require('fs')
const sHtml = fs.readFileSync('./algo/index.html', 'utf-8')
const pathArr = sHtml.match(/<script src="[^"]+">/g).map(str => './algo' + str.slice(str.indexOf('"') + 2, str.lastIndexOf('"')))
pathArr.shift()

let sJs = pathArr.map((path, idx) => {
  return fs.readFileSync(path)
}).join('\n\n')

const classList = sJs.match(/^class \w+ /gm).map(str => '  ' + str.slice(str.indexOf(' ') + 1).trim())

sJs += `

export default {
${classList.join(',\n')}
}
`

fs.writeFileSync('./src/components/algo/algoAll.js', sJs)