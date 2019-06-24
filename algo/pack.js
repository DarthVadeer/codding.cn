const fs = require('fs')
const pathArr = [
  './algo/js/Common.js',
  './algo/js/SelectionSort.js',
  './algo/js/InsertionSort.js',
  './algo/js/MergeSort.js',
  './algo/js/QuickSort.js',
  './algo/js/QuickSort2.js',
  './algo/js/QuickSort3.js',
  './algo/js/MaxHeap.js',
  './algo/js/SegmentTree.js',
  './algo/js/BinarySearch.js',
  './algo/js/AVLTree.js',
  './algo/js/RBTree.js',
  './algo/js/Trie.js',
  './algo/js/MazeData.js',
  './algo/js/Maze.js',
  './algo/js/Vicsek.js',
  './algo/js/Sierpinski.js',
  './algo/js/SierpinskiTriangle.js',
  './algo/js/KoachSnowflake.js',
  './algo/js/FractalTree.js',
  './algo/js/MineSweeper.js',
  './algo/js/Algo.js',
]

let result = ''
pathArr.forEach((path, idx, arr) => {
  result += fs.readFileSync(path, 'utf-8') + '\n\n'
})

result = result + `export default Algo`

fs.writeFileSync('./src/components/algo/algoAll.js', result)