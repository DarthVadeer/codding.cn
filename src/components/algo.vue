<template>
  <div class="algo auto-scroll">
    <div class="wrapper">
      <div class="row">
        <div
          class="col-sm-6"
          v-for="(item, idx) in $root.algo.list"
        >
          <div class="algo-card shadow"
            @click="$root.pushCom('algo-info', {idxAlgo: idx})"
          >
            <img :src="item.img" style="width: 100%;">
            <div class="ellipsis text-box">{{item.title}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'algo',
  rootData() {
    return {
      algo: {
        list: [
          {
            title: '红黑树可视化',
            desc: `感谢 <a href="http://www.imooc.com/t/108955" target="_blank">@liuyubobobo</a> 的支持`,
            img: './static/img/tree-rb.png',
            urlTarget: 'http://codding.cn/rbTree/',
            urlXhr: 'http://codding.cn/rbTree/',
            time: 1540883641836,
            links: [
              {name: '在线查看', url: 'http://codding.cn/rbTree/'},
              {name: '随机', url: 'http://codding.cn/rbTree/rand.html'},
              {name: '快速', url: 'http://codding.cn/rbTree/quick.html'},
            ]
          },
          {
            title: 'AVL树可视化',
            desc: `感谢 <a href="http://www.imooc.com/t/108955" target="_blank">@liuyubobobo</a> 的支持`,
            img: './static/img/tree-avl.png',
            urlTarget: 'http://codding.cn/avl/',
            urlXhr: 'http://codding.cn/avl/',
            time: 1540883641836,
            links: [
              {name: '在线查看', url: 'http://codding.cn/avl/'},
              {name: '随机', url: 'http://codding.cn/avl/avl-random.html'},
            ]
          },
          {
            title: '二分搜索树可视化',
            desc: `感谢 <a href="http://www.imooc.com/t/108955" target="_blank">@liuyubobobo</a> 的支持 <br /> 借助中序遍历的有序性，进行排序`,
            img: './static/img/tree-bst.png',
            urlTarget: 'http://codding.cn/binarySearch/',
            urlXhr: 'http://codding.cn/binarySearch/',
            time: 1540883641836,
            links: [
              {name: '在线查看', url: 'http://codding.cn/binarySearch/'},
              {name: '排版原理', url: 'http://codding.cn/binarySearch/indexAnimate.html'},
            ]
          },
          {
            title: '快速排序-双路',
            desc: `感谢 <a href="http://www.imooc.com/t/108955" target="_blank">@liuyubobobo</a> 的支持`,
            img: './static/img/quicksort-two-way.png',
            urlTarget: 'http://codding.cn/quickSort/',
            urlXhr: 'http://codding.cn/quickSort/',
            time: 1540883641836,
            links: [
              {name: '在线查看', url: 'http://codding.cn/quickSort/'}
            ]
          },
          {
            title: '最大堆-可视化',
            desc: `感谢 <a href="http://www.imooc.com/t/108955" target="_blank">@liuyubobobo</a> 的支持`,
            img: './static/img/tree-maxheap.png',
            urlTarget: 'http://codding.cn/maxHeap/',
            urlXhr: 'http://codding.cn/maxHeap/',
            time: 1540883641836,
            links: [
              {name: '在线查看', url: 'http://codding.cn/maxHeap/'}
            ]
          },
          {
            title: 'tween运动',
            desc: `非常赞的运动算法`,
            img: './static/img/tween.png',
            urlTarget: 'http://codding.cn/tween/',
            urlXhr: 'http://codding.cn/tween/js/tween.js',
            time: 1540883641836,
            links: [
              {name: '在线查看', url: 'http://codding.cn/tween/'}
            ]
          },
        ],
      }
    }
  },
  rootMethods: {

  },
  mounted() {
    
  }
}
</script>

<style lang="scss" scoped>
.algo {
  .wrapper {
    .algo-card {
      margin-bottom: 15px; border-radius: 4px; overflow: hidden;
      background: #fff; cursor: pointer;
      .text-box {
        border-top: 1px solid #e7e7e7; padding: .8em 1em;
      }
    }
  }
}
</style>