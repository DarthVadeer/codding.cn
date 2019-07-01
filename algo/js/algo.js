class Algo {
  constructor(d = {}) {
    this.d = d

    const allAlgo = {
      Maze,
      FractalTree,
      KoachSnowflake,
      SierpinskiTriangle,
      Sierpinski,
      Vicsek,
      Fib,
      Trie,
      RBTree,
      AVLTree,
      BinarySearch,
      SegmentTree,
      MaxHeap,
      QuickSort3,
      QuickSort2,
      QuickSort,
      MergeSort,
      InsertionSort,
      SelectionSort,
    }

    d.type = d.type || {}
    d.type.list = d.type.list || [
      // {name: '迷宫寻路 - 广度 - 非递归', cons: 'Maze', startFn: 'bfs'},
      // {name: '迷宫寻路 - 深度优先 - 非递归', cons: 'Maze', startFn: 'dfs2'},
      // {name: '迷宫寻路 - 深度优先 - 递归', cons: 'Maze', startFn: 'dfs1'},
      {name: '分形图 - FractalTree', cons: 'FractalTree', startFn: 'create', arg: {degL: -5, degR: 25, translateX: -120}},
      {name: '分形图 - FractalTree', cons: 'FractalTree', startFn: 'create', arg: {}},
      {name: '分形图 - KoachSnowflake', cons: 'KoachSnowflake', startFn: 'create'},
      {name: '分形图 - SierpinskiTriangle', cons: 'SierpinskiTriangle', startFn: 'create'},
      {name: '分形图 - Sierpinski', cons: 'Sierpinski', startFn: 'create'},
      {name: '分形图 - Vicsek', cons: 'Vicsek', startFn: 'create'},
      {name: '分形图 - 斐波那契数列', cons: 'Fib', startFn: 'create'},
      {name: 'Trie', cons: 'Trie', startFn: 'create'},
      {name: '红黑树 - 左倾&右倾', cons: 'RBTree', startFn: 'create'},
      {name: 'AVL树', cons: 'AVLTree', startFn: 'create'},
      {name: '二分搜索树 - 镜像反转', cons: 'BinarySearch', startFn: 'create'},
      {name: '线段树 - R', cons: 'SegmentTree', startFn: 'createR'},
      {name: '线段树 - L', cons: 'SegmentTree', startFn: 'createL'},
      {name: '最大堆 - shiftUp', cons: 'MaxHeap', startFn: 'createByShiftUp'},
      {name: '最大堆 - heapify', cons: 'MaxHeap', startFn: 'heapify'},
      {name: '三路快排', cons: 'QuickSort3', startFn: 'startSort'},
      {name: '双路快排', cons: 'QuickSort2', startFn: 'startSort'},
      {name: '单路快排', cons: 'QuickSort', startFn: 'startSort'},
      {name: '归并排序', cons: 'MergeSort', startFn: 'startSort'},
      {name: '插入排序', cons: 'InsertionSort', startFn: 'startSort'},
      {name: '选择排序', cons: 'SelectionSort', startFn: 'startSort'},
    ]

    const nodeList = document.querySelector('#box-algo > .list')

    nodeList.innerHTML = d.type.list.map((v) => {
      return `
        <section>
          <div class="btn-box">
            <button class="btn btn-primary">${v.name}</button>
          </div>
          <div class="btn-canvas">
            <canvas data-title="${v.name}"></canvas>
          </div>
        </section>
      `
    }).join('')

    const len = 20
    let randArr = [].rnd(len, 1, len * 5)
    // randArr = new Array(len).fill().map((_, idx) => len - idx)

    randArr = randArr.map(n => new Node(n))
    const gdList = []

    nodeList.querySelectorAll('canvas').forEach((canvas, idx) => {
      const typeItem = d.type.list[idx]
      const gd = canvas.getContext('2d')
      try {
        gdList.push(typeItem.cons + ' - ' + gd)
      } catch (e) {
        alert('error')
      }
      console.time(typeItem.cons)
      const o = new allAlgo[typeItem.cons]({
        canvas,
        gd,
        arr: randArr.clone(),
        typeItem,
      })

      o[typeItem.startFn](typeItem.arg)
      o.setPos()
      o.render()
      o.log && o.log()
      console.timeEnd(typeItem.cons)
    })

    setTimeout(() => {
      test.innerHTML = gdList.join('<br /><br />')
    }, 2000)
  }
}

Algo.conf = {
  itemWidth: 30,
  itemHeight: 18,
  levelHeight: 36,
  paddingH: 15,
  paddingV: 15,
  paddingTop: 0,
  lineHeight: 14 * 1.5,
  scale: devicePixelRatio,
  font: '14px Arial',
  fontSm: '12px Arial',
  fontLg: '16px Arial',
}

Algo.color = {
  red: '#F44336',
  pink: '#E91E63',
  purple: '#9C27B0',
  deepPurple: '#673AB7',
  indigo: '#3F51B5',
  blue: '#2196F3',
  lightBlue: '#03A9F4',
  cyan: '#00BCD4',
  teal: '#009688',
  green: '#4CAF50',
  lightGreen: '#8BC34A',
  lime: '#CDDC39',
  yellow: '#FFEB3B',
  amber: '#FFC107',
  orange: '#FF9800',
  deepOrange: '#FF5722',
  brown: '#795548',
  grey: '#9E9E9E',
  blueGrey: '#607D8B',
  black: '#000000',
  white: '#FFFFFF',
}
