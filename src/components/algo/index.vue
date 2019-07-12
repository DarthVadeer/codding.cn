<template>
  <div id="box-algo" class="panel-stack">
    <div class="card-list respond-list">
      <section
        v-for="(typeItem, idx) in algoList"
        :class="['card-item', 'respond-item', 'fade', typeItem.isReady ? 'fadeIn' : 'fadeOut']"
        @click="showAlgoInfo(typeItem, idx)"
      >
        <div class="inner">
          <div class="img-box"></div>
          <div class="text ellipsis">{{typeItem.name}}</div>
        </div>
      </section>
    </div>
    <transition name="fade">
      <div class="algo-forward space c" v-if="r.algoInfo">
        <!-- <pre style="text-align: left;">{{algoInfo}}</pre> -->
        <section v-for="(item, idx) in algoInfo.list">
          <div class="box-btn">
            <button class="btn btn-primary">{{item.name}}</button>
          </div>
          <div class="box-canvas">
            <canvas ref="canvas"></canvas>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script>
import allAlgo from './allAlgo'

export default {
  name: 'algo',
  data() {
    return {
      algoList: [
        {isReady: 0, name: '迷宫创建 - 随机队列', cons: 'Maze', startFn: 'generateRand', arg: {}},
        {isReady: 0, name: '迷宫创建 - 广度优先 - 非递归', cons: 'Maze', startFn: 'generateBfs', arg: {}},
        {isReady: 0, name: '迷宫创建 - 深度优先 - 非递归', cons: 'Maze', startFn: 'generateDfs2', arg: {}},
        {isReady: 0, name: '迷宫创建 - 深度优先 - 递归', cons: 'Maze', startFn: 'generateDfs1', arg: {}},
        {isReady: 0, name: '迷宫寻路 - 广度优先 - 非递归', cons: 'Maze', startFn: 'bfs', arg: {}},
        {isReady: 0, name: '迷宫寻路 - 深度优先 - 非递归', cons: 'Maze', startFn: 'dfs2', arg: {}},
        {isReady: 0, name: '迷宫寻路 - 深度优先 - 递归', cons: 'Maze', startFn: 'dfs1', arg: {}},
        // {isReady: 0, name: '分形图 - FractalTree', cons: 'Fractal', startFn: 'FractalTree', arg: {translateX: -80, degL: -5, degR: 20}},
        {isReady: 0, name: '分形图 - FractalTree', cons: 'Fractal', startFn: 'FractalTree', arg: {}},
        {isReady: 0, name: '分形图 - KoachSnowflake', cons: 'Fractal', startFn: 'KoachSnowflake', arg: {}},
        {isReady: 0, name: '分形图 - SierpinskiTriangle', cons: 'Fractal', startFn: 'SierpinskiTriangle', arg: {}},
        {isReady: 0, name: '分形图 - Sierpinski', cons: 'Fractal', startFn: 'Sierpinski', arg: {}},
        {isReady: 0, name: '分形图 - Vicsek', cons: 'Fractal', startFn: 'Vicsek', arg: {}},
        {isReady: 0, name: '分形图 - 斐波那契数列', cons: 'Fractal', startFn: 'Fib', arg: {}},
        {isReady: 0, name: '分形图 - 1/2 + 1/4 ... 1/n ≈ 1', cons: 'Fractal', startFn: 'NearOne', arg: {}},
        {isReady: 0, name: 'Trie', cons: 'Trie', startFn: 'create', arg: {}},
        {isReady: 0, name: '红黑树 - 左倾&右倾', cons: 'Tree', startFn: 'RB', arg: {}},
        {isReady: 0, name: 'AVL树', cons: 'Tree', startFn: 'AVL', arg: {}},
        {isReady: 0, name: '二分搜索树 - 镜像反转', cons: 'Tree', startFn: 'BinaryFlip', arg: {}},
        {isReady: 0, name: '二分搜索树', cons: 'Tree', startFn: 'Binary', arg: {}},
        {isReady: 0, name: '线段树 - R', cons: 'Heap', startFn: 'SegmentTreeR', arg: {}},
        {isReady: 0, name: '线段树 - L', cons: 'Heap', startFn: 'SegmentTreeL', arg: {}},
        // {isReady: 0, name: '线段树 - R', cons: 'SegmentTree', startFn: 'createR', arg: {}},
        // {isReady: 0, name: '线段树', cons: 'SegmentTree', startFn: 'createL', arg: {}},
        {isReady: 0, name: '最大堆 - shiftUp', cons: 'Heap', startFn: 'createByShiftUp', arg: {}},
        {isReady: 0, name: '最大堆 - heapify', cons: 'Heap', startFn: 'heapify', arg: {}},
        {isReady: 0, name: '三路快排 - QuickSort3', cons: 'Sort', startFn: 'QuickSort3', arg: {}},
        {isReady: 0, name: '双路快排 - QuickSort2', cons: 'Sort', startFn: 'QuickSort2', arg: {}},
        {isReady: 0, name: '单路快排 - QuickSort1', cons: 'Sort', startFn: 'QuickSort1', arg: {}},
        {isReady: 0, name: '归并排序 - MergeSort', cons: 'Sort', startFn: 'MergeSort', arg: {}},
        {isReady: 0, name: '插入排序 - InsertionSort', cons: 'Sort', startFn: 'InsertionSort', arg: {}},
        {isReady: 0, name: '选择排序 - SelectionSort', cons: 'Sort', startFn: 'SelectionSort', arg: {}},
      ]
    }
  },
  methods: {
    showAlgoInfo(elItem, idx) {
      const vm = this.$root

      vm.updateRouter({
        algoInfo: {
          ...elItem,
          isReady: undefined,
        },
      }, 'push')
    },
    renderAlgo() {
      const vm = this.$root
      const r = vm.router

      if (r.algoInfo) {
        const canvasList = this.$refs.canvas
        console.clear()
        this.algoInfo.list.forEach((typeItem, idx) => {
          const canvas = canvasList[idx]
          const o = new allAlgo[this.algoInfo.cons]({
            canvas,
            gd: canvas.getContext('2d'),
            arr: typeItem.randArr,
            conf: allAlgo.Algo.conf,
            color: allAlgo.Algo.color,
            typeItem,
          })

          vm.algo.map[typeItem.cons + '-' + typeItem.startFn] = o
          o[this.algoInfo.startFn](typeItem.arg)
          o.setPos()
          o.render()
        })
        return
      }

      if (this.algoRendered) return
      this.algoRendered = true

      const imgBoxList = document.querySelectorAll('#box-algo .card-list .img-box')
      const len = 20
      let randArr = [].rnd(len, 1, len * 5).map(n => new allAlgo.Node(n))

      this.algoList.forEach((typeItem, idx) => {
        setTimeout(() => {
          const imgBox = imgBoxList[idx]
          const canvas = document.createElement('canvas')
          const img = new Image()
          img.onload = () => {
            imgBox.style.backgroundImage = 'url(' + img.src + ')'
            typeItem.isReady = true
          }

          const o = new allAlgo[typeItem.cons]({
            canvas,
            gd: canvas.getContext('2d'),
            arr: randArr.clone(),
            conf: allAlgo.Algo.conf,
            color: allAlgo.Algo.color,
            typeItem,
          })

          vm.algo.map[typeItem.cons + '-' + typeItem.startFn] = o
          o[typeItem.startFn](typeItem.arg)
          o.setPos()
          o.render()

          canvas.toBlob((blob) => {
            img.src = URL.createObjectURL(blob)
          })
        }, (idx + 1) * vm.algoTimeDelay + 300)
      })
    },
  },
  computed: {
    r() {
      return this.$root.router
    },
    algoInfo() {
      const vm = this.$root
      const r = vm.router
      const algoInfo = this.r.algoInfo
      const len = 20
      let list = []

      switch (algoInfo.cons) {
        case 'Sort':
        case 'Tree':
        case 'Heap':
          list = [
            {name: '完全随机 - ' + algoInfo.name, randArr: [].rnd(len, 1, len * 5)},
            {name: '完全正序 - ' + algoInfo.name, randArr: new Array(len).fill().map((_, idx) => idx + 1)},
            {name: '完全逆序 - ' + algoInfo.name, randArr: new Array(len).fill().map((_, idx) => len - idx)},
          ]

          if (algoInfo.cons === 'Sort') {
            list.push({name: '大量重复 - ' + algoInfo.name, randArr: [].rnd(len, 1, 5)})
          }
          break
        case 'SegmentTree':
          list = [
            {isReady: 0, name: '线段树 - L', cons: 'SegmentTree', startFn: 'createL', arg: {}},
            {isReady: 0, name: '线段树 - R', cons: 'SegmentTree', startFn: 'createR', arg: {}},
          ]
          break
        case 'Fractal':
          switch (r.algoInfo.startFn) {
            case 'Fib':
              list = [
                {name: '分形图 - 斐波那契数列', cons: 'Fractal', startFn: 'Fib', arg: {}},
                {name: '分形图 - 斐波那契数列 - 辅助线', cons: 'Fractal', startFn: 'Fib', arg: {isRenderAux: true}},
              ]
              break
            case 'FractalTree':
              list = [
                {isReady: 0, name: '分形图 - FractalTree', cons: 'Fractal', startFn: 'FractalTree', arg: {translateY: -40}},
                {isReady: 0, name: '分形图 - FractalTree (-4, 25)', cons: 'Fractal', startFn: 'FractalTree', arg: {translateX: -80, translateY: -50, degL: -4, degR: 25}},
                {isReady: 0, name: '分形图 - FractalTree (-35, 0)', cons: 'Fractal', startFn: 'FractalTree', arg: {side: 100, translateX: 40, translateY: -50, degL: -35, degR: 0}},
                {isReady: 0, name: '分形图 - FractalTree (-45, 45)', cons: 'Fractal', startFn: 'FractalTree', arg: {side: 90, translateX: 0, translateY: -140, degL: -45, degR: 45, depth: 14}},
              ]
              break
            default:
              list = [clone(algoInfo)]
              break
          }
          break
        default:
          list = [clone(algoInfo)]
          break
      }

      list.forEach(item => item.randArr = (item.randArr || []).map(n => new allAlgo.Node(n)))
      algoInfo.list = list

      return algoInfo
    },
  },
  watch: {
    'r.algoInfo'() {
      this.$nextTick(() => {
        this.renderAlgo()
      })
    },
  },
  mounted() {
    const vm = this.$root

    vm.algo.map = {}
    this.renderAlgo()
  },
  beforeCreate() {
    this.$root.algo = this
  },
  beforeDestroy() {
    // !vm.is.local && delete this.$root.algo
  },
}
</script>

<style lang="scss">
#box-algo {
  .card-list {
    .card-item {
      .img-box {
        background: #fff no-repeat center / contain;
      }
    }
  }
  .algo-forward {
    padding-top: 20px;
    section {
       margin-bottom: 20px;
      .box-btn {margin-bottom: 20px;}
      .box-btn button {}
      .box-canvas {}
      .box-canvas canvas {border: 1px solid #ccc; vertical-align: top; max-width: 100%;}
    }
  }
}
</style>