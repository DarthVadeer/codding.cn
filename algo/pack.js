const fs = require('fs')
const pathResult = '../src/components/algo/'
const pathArr = [
  './js/common.js',
  './js/MergeSort.js',
  './js/QuickSort.js',
  './js/QuickSort2.js',
  './js/QuickSort3.js',
  './js/BinarySearch.js',
  './js/BinarySearchFlip.js',
  './js/AVLTree.js',
  './js/RBTree.js',
  './js/MaxHeap.js',
  './js/SegmentTree.js',
  './js/algo.js',
]

let result = ''
pathArr.forEach((path, idx, arr) => {
  result += fs.readFileSync(path, 'utf-8') + '\n\n'
})

classExport = `
export default Algo
`

fs.writeFileSync(pathResult + 'algoAll.js', result + classExport)
console.log('处理完毕')