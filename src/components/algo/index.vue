<template>
  <div id="box-algo">
    <div class="container">
      <div class="algo-list">
        <section
          v-for="(typeItem, idx) in type.list"
          class="col-md-4 col-sm-6 col-xs-12"
        >
          <div class="inner">
            <div class="img-box"></div>
            <div class="text">{{typeItem.name}}</div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Algo from './algoAll'

export default {
  name: 'algo',
  data() {
    return {
      type: {
        list: [
          {
            name: '斐波那契数列',
            cons: 'Fib',
            startFn: 'create',
            list: [],
          }, {
            name: '分形图',
            cons: 'FractalTree',
            startFn: 'renderTree',
            args: [-90, 20, -20, 0],
            list: [
              {name: '分形图 - FractalTree', cons: 'FractalTree', startFn: 'renderTree', args: [-90, -10, 30, 0]},
              {name: '分形图 - FractalTree', cons: 'FractalTree', startFn: 'renderTree', args: [-90, 20, -20, 0]},
              {name: '分形图 - KoachSnowflake', cons: 'KoachSnowflake', startFn: 'create'},
              {name: '分形图 - SierpinskiTriangle', cons: 'SierpinskiTriangle', startFn: 'create'},
              {name: '分形图 - Sierpinski', cons: 'Sierpinski', startFn: 'create'},
              {name: '分形图 - Vicsek', cons: 'Vicsek', startFn: 'create'},
            ]
          }, {
            name: '多叉树 - Trie',
            cons: 'Trie',
            startFn: 'create',
            list: [
              {name: 'Trie', cons: 'Trie', startFn: 'create'},
            ]
          }, {
            name: '二叉树 - 二分搜索树',
            cons: 'AVLTree',
            startFn: 'create',
            list: [
              {name: '红黑树 (L&R)', cons: 'RBTree', startFn: 'create'},
              {name: 'AVL树', cons: 'AVLTree', startFn: 'create'},
              {name: '二分搜索树-镜像反转', cons: 'BinarySearch', startFn: 'create'},
              {name: '线段树 - R', cons: 'SegmentTree', startFn: 'createR'},
              {name: '线段树 - L', cons: 'SegmentTree', startFn: 'createL'},
            ]
          }, {
            name: '二叉树 - 线段树',
            cons: 'SegmentTree',
            startFn: 'createR',
            list: [

            ]
          }, {
            name: '二叉树 - 最大堆',
            cons: 'MaxHeap',
            startFn: 'createByShiftUp',
            list: [
              {name: '最大堆-shiftUp', cons: 'MaxHeap', startFn: 'createByShiftUp'},
              {name: '最大堆-heapify', cons: 'MaxHeap', startFn: 'heapify'},
            ]
          }, {
            name: '排序算法',
            cons: 'QuickSort3',
            startFn: 'startSort',
            list: [
              {name: '三路排序', cons: 'QuickSort3', startFn: 'startSort'},
              {name: '双路排序', cons: 'QuickSort2', startFn: 'startSort'},
              {name: '单路排序', cons: 'QuickSort', startFn: 'startSort'},
              {name: '归并排序', cons: 'MergeSort', startFn: 'startSort'},
              {name: '插入排序', cons: 'InsertionSort', startFn: 'startSort'},
              {name: '选择排序', cons: 'SelectionSort', startFn: 'startSort'},
            ]
          },
        ]
      }
    }
  },
  methods: {

  },
  mounted() {
    const vm = this.$root
    const len = 20
    let randArr = [].rnd(len, 1, 99)
    // randArr = new Array(len).fill().map((_, idx) => idx)
    randArr = randArr.map(n => new Algo.Item(n))

    const imgBoxs = document.querySelectorAll('#box-algo .algo-list .img-box')
    this.type.list.forEach((typeItem, idx) => {
      // console.time(typeItem.cons.name)
      const canvas = document.createElement('canvas')
      const imgBox = imgBoxs[idx]
      const o = new Algo[typeItem.cons]({
        canvas,
        gd: canvas.getContext('2d'),
        arr: randArr.clone(),
        typeItem: typeItem,
      })

      o[typeItem.startFn](typeItem.args)
      o.setPos()
      o.render()
      o.log && o.log()
      // console.timeEnd(typeItem.cons.name)

      canvas.toBlob((blob) => {
        const img = new Image()
        const src = URL.createObjectURL(blob)

        img.src = src
        imgBox.style.backgroundImage = 'url(' + src + ')'
      })
    })
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
  padding: 15px 0; background: #eee !important;
  .container {
    padding: 0 7.5px;
    .algo-list {
      section {
        padding: 0 7.5px;
        .inner {
          border: 1px solid #ccc; margin-bottom: 15px; border-radius: 4px;
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
}
</style>