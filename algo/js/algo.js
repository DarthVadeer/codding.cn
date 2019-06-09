class Algo {
  constructor(d = {}) {
    this.d = d

    d.devicePixelRatio = devicePixelRatio
    // d.devicePixelRatio = devicePixelRatio === 1 ? 2 : devicePixelRatio
    d.type = {
      list: [
        {name: 'Trie', cons: Trie, opt: {startFn: 'create'}},
        {name: '红黑树 (左倾 & 右倾)', cons: RBTree, opt: {startFn: 'create'}},
        {name: 'AVL树', cons: AVLTree, opt: {startFn: 'create'}},
        {name: '二分搜索树 - 镜像反转', cons: BinarySearch, opt: {startFn: 'create'}},
        {name: '线段树 R', cons: SegmentTree, opt: {startFn: 'createR'}},
        {name: '线段树 L', cons: SegmentTree, opt: {startFn: 'createL'}},
        {name: '最大堆 - shiftUp', cons: MaxHeap, opt: {startFn: 'createByShiftUp'}},
        {name: '最大堆 - heapify', cons: MaxHeap, opt: {startFn: 'heapify'}},
        {name: '三路排序', cons: QuickSort3, opt: {startFn: 'startSort'}},
        {name: '双路排序', cons: QuickSort2, opt: {startFn: 'startSort'}},
        {name: '快速排序', cons: QuickSort, opt: {startFn: 'startSort'}},
        {name: '归并排序', cons: MergeSort, opt: {startFn: 'startSort'}},
      ]
    }

    // if (location.origin.indexOf('codding.cn') > -1) d.type.list.reverse()

    d.cons = {
      list: []
    }

    d.conf = {
      itemWidth: 30,
      itemHeight: 18,
      levelHeight: 40,
      paddingH: 15,
      paddingV: 15,
      fontLg: '16px Arial',
      font: '14px Arial',
      fontSm: '12px Arial',
    }

    const nodeList = document.querySelector('#box-algo > .list')

    nodeList.innerHTML = d.type.list.map((v) => {
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
    // randArr = new Array(len).fill().map((_, idx) => idx)

    randArr = randArr.map(n => new Node(n))

    nodeList.querySelectorAll('canvas').forEach((canvas, idx, arr) => {
      const type = d.type.list[idx]
      const o = new type.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        ...d,
      })

      d.cons.list.push(o)
      o[type.opt.startFn]()
      o.setPos()
      o.render()
    })
  }
}