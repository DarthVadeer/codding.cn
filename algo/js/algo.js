class Algo {
  constructor(d = {}) {
    const me = this

    me.d = d

    d.type = {
      list: [
        {name: '分形图 - FractalTree', cons: FractalTree, startFn: 'create'},
        {name: '分形图 - KoachSnowflake', cons: KoachSnowflake, startFn: 'create'},
        {name: '分形图 - SierpinskiTriangle', cons: SierpinskiTriangle, startFn: 'create'},
        {name: '分形图 - Sierpinski', cons: Sierpinski, startFn: 'create'},
        {name: '分形图 - Vicsek', cons: Vicsek, startFn: 'create'},
        {name: '迷宫创建 - 随机队列 - 2', cons: Maze, startFn: 'generateRandomQueue2'},
        {name: '迷宫创建 - 随机队列 - 1', cons: Maze, startFn: 'generateRandomQueue1'},
        {name: '迷宫创建 - 广度优先', cons: Maze, startFn: 'generate3'},
        {name: '迷宫创建 - 深度优先 - 非递归', cons: Maze, startFn: 'generate2'},
        // {name: '迷宫创建 - 深度优先 - 递归', cons: Maze, startFn: 'generate1'},
        {name: '迷宫遍历 - 广度优先', cons: Maze, startFn: 'bfs'},
        {name: '迷宫遍历 - 深度优先 - 非递归', cons: Maze, startFn: 'dfs2'},
        {name: '迷宫遍历 - 深度优先 - 递归', cons: Maze, startFn: 'dfs1'},
        {name: 'Trie', cons: Trie, startFn: 'create'},
        {name: '红黑树 (左倾 & 右倾)', cons: RBTree, startFn: 'create'},
        {name: 'AVL树', cons: AVLTree, startFn: 'create'},
        {name: '二分搜索树 - 镜像反转', cons: BinarySearch, startFn: 'create'},
        {name: '线段树 - R', cons: SegmentTree, startFn: 'createR'},
        {name: '线段树 - L', cons: SegmentTree, startFn: 'createL'},
        {name: '最大堆 - shiftUp', cons: MaxHeap, startFn: 'createByShiftUp'},
        {name: '最大堆 - hepify', cons: MaxHeap, startFn: 'heapify'},
        {name: '三路排序', cons: QuickSort3, startFn: 'startSort'},
        {name: '双路排序', cons: QuickSort2, startFn: 'startSort'},
        {name: '快速排序', cons: QuickSort, startFn: 'startSort'},
        {name: '归并排序', cons: MergeSort, startFn: 'startSort'},
        {name: '插入排序', cons: InsertionSort, startFn: 'startSort'},
        {name: '选择排序', cons: SelectionSort, startFn: 'startSort'},
      ]
    }

    d.cons = {
      list: []
    }

    d.conf = {
      itemWidth: 26,
      itemHeight: 16,
      levelHeight: 36,
      paddingH: 15,
      paddingV: 15,
      font: '14px Arial',
      fontSm: '12px Arial',
      fontLg: '16px Arial',
      devicePixelRatio: devicePixelRatio < 2 ? 2 : devicePixelRatio,
      devicePixelRatio,
    }

    const nodeList = document.querySelector('#box-algo > .list')

    nodeList.innerHTML = d.type.list.map((v) => {
      return `
        <section>
          <div class="box-btn">
            <button class="btn btn-primary">${v.name}</button>
          </div>
          <div class="box-canvas">
            <canvas title="${v.name}"></canvas>
          </div>
        </section>
      `
    }).join('')

    const len = 24
    let randArr = [].rnd(len, 1)

    // randArr = new Array(len).fill().map((_, idx) => len - idx)
    // randArr = new Array(len).fill().map((_, idx) => idx)
    // console.log(randArr)

    randArr = randArr.map(n => new Node(n))
    
    nodeList.querySelectorAll('canvas').forEach(async (canvas, idx, arr) => {
      const type = d.type.list[idx]

      const o = new type.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        btn: canvas.closest('section').querySelector('.btn'),
        algo: this,
        ...d,
        type,
      })

      d.cons.list.push(o)
      o[type.startFn]()
      o.setPos()
      ;![Maze].some(cons => type.cons === cons) && o.render()
    })
  }
}