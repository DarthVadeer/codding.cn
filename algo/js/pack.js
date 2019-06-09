const fs = require('fs')
const pathArr = [
  './Common.js',
  './MergeSort.js',
  './QuickSort.js',
  './QuickSort2.js',
  './QuickSort3.js',
  './MaxHeap.js',
  './SegmentTree.js',
  './BinarySearch.js',
  './AVLTree.js',
  './RBTree.js',
  './Trie.js',
  './Algo.js',
]

let result = ''
pathArr.forEach((path, idx, arr) => {
  result += fs.readFileSync(path, 'utf-8') + '\n\n'
})

result = result + `

export default Algo
`

fs.writeFileSync('../../src/components/algo/algoAll.js', result)