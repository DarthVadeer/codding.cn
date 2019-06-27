class Algo {
  constructor(d = {}) {
    this.d = d

    d.type = {
      list: [
        {name: '斐波那契数列', cons: Fib, startFn: 'create'},
        // {name: '分形图 - FractalTree', cons: FractalTree, startFn: 'renderTree', args: [-90, -10, 30, 0]},
        // {name: '分形图 - FractalTree', cons: FractalTree, startFn: 'renderTree', args: [-90, 20, -20, 0]},
        // {name: '分形图 - KoachSnowflake', cons: KoachSnowflake, startFn: 'create'},
        // {name: '分形图 - SierpinskiTriangle', cons: SierpinskiTriangle, startFn: 'create'},
        // {name: '分形图 - Sierpinski', cons: Sierpinski, startFn: 'create'},
        // {name: '分形图 - Vicsek', cons: Vicsek, startFn: 'create'},
        // {name: 'Trie', cons: Trie, startFn: 'create'},
        // {name: '红黑树 (L&R)', cons: RBTree, startFn: 'create'},
        // {name: 'AVL树', cons: AVLTree, startFn: 'create'},
        // {name: '二分搜索树-镜像反转', cons: BinarySearch, startFn: 'create'},
        // {name: '线段树 - R', cons: SegmentTree, startFn: 'createR'},
        // {name: '线段树 - L', cons: SegmentTree, startFn: 'createL'},
        // {name: '最大堆-shiftUp', cons: MaxHeap, startFn: 'createByShiftUp'},
        // {name: '最大堆-heapify', cons: MaxHeap, startFn: 'heapify'},
        // {name: '三路排序', cons: QuickSort3, startFn: 'startSort'},
        // {name: '双路排序', cons: QuickSort2, startFn: 'startSort'},
        // {name: '单路排序', cons: QuickSort, startFn: 'startSort'},
        // {name: '归并排序', cons: MergeSort, startFn: 'startSort'},
        // {name: '插入排序', cons: InsertionSort, startFn: 'startSort'},
        // {name: '选择排序', cons: SelectionSort, startFn: 'startSort'},
      ]
    }

    d.cons = {
      list: [],
      map: {},
    }

    const nodeList = document.querySelector('#box-algo > .list')

    nodeList.innerHTML = d.type.list.map((v) => {
      return `
        <section>
          <div class="box-btn">
            <button class="btn btn-primary">${v.name}</button>
          </div>
          <div class="box-canvas">
            <canvas data-title="${v.name}"></canvas>
          </div>
        </section>
      `
    }).join('')

    const len = 20
    let randArr = [].rnd(len, 1)
    randArr = randArr.map(n => new Item(n))

    nodeList.querySelectorAll('canvas').forEach((canvas, idx) => {
      const typeItem = d.type.list[idx]
      // console.time(typeItem.cons.name)
      const o = new typeItem.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        color: Algo.color,
        conf: Algo.conf,
        typeItem: typeItem,
      })

      d.cons.list.push(o)
      d.cons.map[typeItem.name] = o
      o[typeItem.startFn](typeItem.args)
      o.setPos()
      o.render()
      o.log && o.log()
      // console.timeEnd(typeItem.cons.name)
    })
  }
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