class Algo {
  constructor(d = {}) {
    const me = this

    me.d = d

    d.conf = {
      sceneSpace: 20,
      itemWidth: 30,
      itemHeight: 20,
      levelHeight: 40,
      fontSm: '12px Arial',
      font: '14px Arial',
    }

    d.color = {
      red: '#d00',
      green: 'green',
      blue: '#09f',
      orange: 'orange',
      purple: 'purple',
      white: 'white',
      black: '#333',
      def: '#333',
    }

    d.cons = {
      list: []
    }

    d.type = {
      list: [
        {name: '红黑树（左倾 & 右倾）', cons: RBTree, opt: {startFn: 'create'}},
        {name: 'AVLTree', cons: AVLTree, opt: {startFn: 'create'}},
        {name: '二分搜索树 - 镜像反转', cons: BinarySearchFlip, opt: {startFn: 'create'}},
        {name: '二分搜索树', cons: BinarySearch, opt: {startFn: 'create'}},
        {name: '线段树 R', cons: SegmentTree, opt: {startFn: 'createR'}},
        {name: '线段树 L', cons: SegmentTree, opt: {startFn: 'createL'}},
        {name: '最大堆 - shiftUp', cons: MaxHeap, opt: {startFn: 'createByShiftUp'}},
        {name: '最大堆 - heapify', cons: MaxHeap, opt: {startFn: 'heapify'}},
        {name: '快速排序3', cons: QuickSort3, opt: {startFn: 'startSort'}},
        {name: '快速排序2', cons: QuickSort2, opt: {startFn: 'startSort'}},
        {name: '快速排序', cons: QuickSort, opt: {startFn: 'startSort'}},
        {name: '归并排序', cons: MergeSort, opt: {startFn: 'startSort'}},
      ]
    }

    location.origin.indexOf('codding.cn') > -1 && d.type.list.reverse()

    const nodeStyle = document.querySelector('#box-algo > .list')

    nodeStyle.innerHTML = d.type.list.map((v) => {
      return `
        <section>
          <div class="box-btn">
            <button class="btn btn-primary">${v.name}</button>
          </div>
          <div class="box-canvas">
            <canvas></canvas>
          </div>
        </section>
      `
    }).join('')

    const len = 20
    let randArr = [].rnd(len, 1)

    randArr = new Array(len).fill().map((_, idx) => len - idx)
    randArr = [5, 11, 14, 16, 4, 9, 12, 17, 18, 4, 10, 15, 11, 14, 2, 12, 15, 18, 15, 4]
    // randArr[len - 1] = 2.5

    randArr = randArr.map((n) => {
      return new Node(n)
    })

    ;[].slice.call(nodeStyle.querySelectorAll('canvas')).forEach((canvas, idx, arr) => {
      const type = d.type.list[idx]
      const o = new type.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        algo: this,
        ...d,
      })

      d.cons.list.push(o)
      o[type.opt.startFn]()
      o.setPos()
      o.render()
    })
  }
}
