<template>
  <div id="box-algo" class="algo--test">
    <div class="algo-list respond-list">
      <section
        v-for="(typeItem, idx) in type.list"
        class="respond-item"
      >
        <div class="inner">
          <div class="img-box"></div>
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
          {name: '迷宫寻路 - 广度优先 - 非递归', cons: allAlgo.Maze, startFn: 'bfs'},
          {name: '迷宫寻路 - 深度优先 - 非递归', cons: allAlgo.Maze, startFn: 'dfs2'},
          {name: '迷宫寻路 - 深度优先 - 递归', cons: allAlgo.Maze, startFn: 'dfs1'},
          {name: '分形图 - FractalTree', cons: allAlgo.FractalTree, startFn: 'create', arg: {side: 120, degL: -5, degR: 25, translateX: -100}},
          {name: '分形图 - FractalTree', cons: allAlgo.FractalTree, startFn: 'create', arg: {side: 120}},
          {name: '分形图 - KoachSnowflake', cons: allAlgo.KoachSnowflake, startFn: 'create'},
          {name: '分形图 - SierpinskiTriangle', cons: allAlgo.SierpinskiTriangle, startFn: 'create'},
          {name: '分形图 - Sierpinski', cons: allAlgo.Sierpinski, startFn: 'create'},
          {name: '分形图 - Vicsek', cons: allAlgo.Vicsek, startFn: 'create'},
          {name: '分形图 - 斐波那契数列', cons: allAlgo.Fib, startFn: 'renderLine', arg: {isRenderAux: false}},
          {name: '多叉树 - Trie', cons: allAlgo.Trie, startFn: 'create'},
          {name: '红黑树 - 左倾&右倾', cons: allAlgo.RBTree, startFn: 'create'},
          {name: 'AVL树', cons: allAlgo.AVLTree, startFn: 'create'},
          {name: '二分搜索树', cons: allAlgo.BinarySearch, startFn: 'create'},
          {name: '线段树 - R', cons: allAlgo.SegmentTree, startFn: 'createR'},
          {name: '线段树 - L', cons: allAlgo.SegmentTree, startFn: 'createL'},
          {name: '最大堆 - shiftUp', cons: allAlgo.MaxHeap, startFn: 'createByShiftUp'},
          {name: '最大堆 - heapify', cons: allAlgo.MaxHeap, startFn: 'heapify'},
          {name: '三路快排', cons: allAlgo.QuickSort3, startFn: 'startSort'},
          {name: '双路快排', cons: allAlgo.QuickSort2, startFn: 'startSort'},
          {name: '单路排序', cons: allAlgo.QuickSort, startFn: 'startSort'},
          {name: '归并排序', cons: allAlgo.MergeSort, startFn: 'startSort'},
          {name: '插入排序', cons: allAlgo.InsertionSort, startFn: 'startSort'},
          {name: '选择排序', cons: allAlgo.SelectionSort, startFn: 'startSort'},
        ]
      }
    }
  },
  methods: {

  },
  mounted() {
    const vm = this.$root
    const imgBoxList = document.querySelectorAll('#box-algo .algo-list .img-box')
    const len = 20
    let randArr = [].rnd(len, 1, len * 5).map(n => new allAlgo.Node(n))

    console.clear()
    console.time('algo.vue')
    this.type.list.forEach((typeItem, idx) => {
      const canvas = document.createElement('canvas')
      console.time(typeItem.cons.name)
      const o = new typeItem.cons({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
      })

      o[typeItem.startFn](typeItem.arg)
      o.setPos()
      o.render()
      // o.log && o.log()
      console.timeEnd(typeItem.cons.name)

      function ready() {
        canvas.toBlob((blob) => {
          const src = URL.createObjectURL(blob)
          const imgBox = imgBoxList[idx]
          imgBox.style.backgroundImage = 'url(' + src + ')'
        })
      }
      ready()
      o.onready = ready
    })
    console.timeEnd('algo.vue')
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
  .algo-list {
    padding: 16px 8px;
    section {
      padding: 0 8px; vertical-align: top;
      .inner {
        border: 1px solid #ccc; margin-bottom: 16px; border-radius: 4px;
        overflow: hidden; cursor: pointer;
        .img-box {
          padding-top: 100%; background: #fff no-repeat center / contain;
        }
        .text {
          height: 1.4em; line-height: 1.4em; border-top: 1px solid #ccc; box-sizing: content-box;
          padding: 1em; background: #f3f6f9;
        }
      }
    }
  }
}

@media (max-width: 500px) {
  #box-algo {
    & > .algo-list {
      & > section {
        width: 100% !important;
      }
    }
  }
}
</style>