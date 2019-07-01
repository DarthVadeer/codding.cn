<template>
  <div id="box-algo">
    <div class="card-list respond-list">
      <section
        v-for="(typeItem, idx) in type.list"
        class="card-item respond-item"
      >
        <div class="inner">
          <div class="img-box">
            <div>
              <canvas></canvas>
            </div>
          </div>
          <div class="text ellipsis">{{typeItem.name}}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import allAlgo from './allAlgo'

export default {
  name: 'algo',
  data() {
    return {
      type: {
        list: [
          {name: '迷宫寻路 - 广度 - 非递归', cons: 'Maze', startFn: 'bfs', arg: {thumb: './static/img/bfs.png'}},
          {name: '迷宫寻路 - 深度优先 - 非递归', cons: 'Maze', startFn: 'dfs2', arg: {thumb: './static/img/dfs2.png'}},
          {name: '迷宫寻路 - 深度优先 - 递归', cons: 'Maze', startFn: 'dfs1', arg: {thumb: './static/img/dfs1.png'}},
          {name: '分形图 - FractalTree', cons: 'FractalTree', startFn: 'create', arg: {degL: -5, degR: 25, translateX: -120}},
          {name: '分形图 - FractalTree', cons: 'FractalTree', startFn: 'create', arg: {}},
          {name: '分形图 - KoachSnowflake', cons: 'KoachSnowflake', startFn: 'create', arg: {}},
          {name: '分形图 - SierpinskiTriangle', cons: 'SierpinskiTriangle', startFn: 'create', arg: {}},
          {name: '分形图 - Sierpinski', cons: 'Sierpinski', startFn: 'create', arg: {}},
          {name: '分形图 - Vicsek', cons: 'Vicsek', startFn: 'create', arg: {}},
          {name: '分形图 - 斐波那契数列', cons: 'Fib', startFn: 'create', arg: {}},
          {name: 'Trie', cons: 'Trie', startFn: 'create', arg: {}},
          {name: '红黑树 - 左倾&右倾', cons: 'RBTree', startFn: 'create', arg: {}},
          {name: 'AVL树', cons: 'AVLTree', startFn: 'create', arg: {}},
          {name: '二分搜索树 - 镜像反转', cons: 'BinarySearch', startFn: 'create', arg: {}},
          {name: '线段树 - R', cons: 'SegmentTree', startFn: 'createR', arg: {}},
          {name: '线段树 - L', cons: 'SegmentTree', startFn: 'createL', arg: {}},
          {name: '最大堆 - shiftUp', cons: 'MaxHeap', startFn: 'createByShiftUp', arg: {}},
          {name: '最大堆 - heapify', cons: 'MaxHeap', startFn: 'heapify', arg: {}},
          {name: '三路快排', cons: 'QuickSort3', startFn: 'startSort', arg: {}},
          {name: '双路快排', cons: 'QuickSort2', startFn: 'startSort', arg: {}},
          {name: '单路快排', cons: 'QuickSort', startFn: 'startSort', arg: {}},
          {name: '归并排序', cons: 'MergeSort', startFn: 'startSort', arg: {}},
          {name: '插入排序', cons: 'InsertionSort', startFn: 'startSort', arg: {}},
          {name: '选择排序', cons: 'SelectionSort', startFn: 'startSort', arg: {}},
        ]
      }
    }
  },
  methods: {

  },
  mounted() {
    const vm = this.$root
    const imgBoxList = document.querySelectorAll('#box-algo .card-list .img-box')
    const len = 20
    let randArr = [].rnd(len, 1, len * 5).map(n => new allAlgo.Node(n))

    // console.clear()
    // console.time('allAlgo')
    this.type.list.forEach((typeItem, idx) => {
      // console.time(typeItem.cons)
      const imgBox = imgBoxList[idx]
      const canvas = imgBox.querySelector('canvas')
      
      if (typeItem.arg.thumb) {
        imgBox.style.backgroundImage = 'url(' + typeItem.arg.thumb + ')'
      } else {
        const o = new allAlgo[typeItem.cons]({
          canvas,
          gd: canvas.getContext('2d'),
          arr: randArr.clone(),
        })
        o[typeItem.startFn](typeItem.arg)
        o.setPos()
        o.render()
      }
      // console.timeEnd(typeItem.cons)
    })
    // console.timeEnd('allAlgo')
  },
  beforeCreate() {
    this.$root.algo = this
  },
  beforeDestroy() {
    delete this.$root.algo
  },
}
</script>

<style lang="scss">
#box-algo {
  background: #eee !important;
}
</style>