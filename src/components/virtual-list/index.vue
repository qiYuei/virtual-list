<template>
  <div ref="virtual-viewPort" class="virtual-list-container">
    <div ref="virtual-scroll" class="virtual-list-scroll" />
    <div
      ref="virtual-list-box"
      class="virtual-list-box"
      :style="{ transform:`translate3d(0,${offset}px,0)` }"
    >
      <div v-for="(item,index) in virtualLists" :key="index">
        <slot :row="item" />
      </div>

    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
export default {
  props: {
    dataSources: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    // 保持多少条渲染
    keepTotals: {
      type: Number,
      default: 10
    },
    renderTag: {
      type: String,
      default: 'div'
    },
    prefetchTotal: {
      type: Number,
      default: 3
    }

  },
  data() {
    return {
      scrollHeight: 100,
      start: 0,
      end: this.keepTotals,
      on_scroll: function() {},
      offset: 0,
      preStart: -1,
      size: 50
    }
  },
  computed: {
    virtualLists() {
      return this.dataSources.slice(this.start, this.end)
    }
  },
  watch: {
    'dataSources': {
      handler: function(newV) {
      // 初始化数据
        this.installVirtualData()
      },
      deep: true
    }
  },
  mounted() {
    this.installVirtualData()
  },
  beforeDestroy() {
    this.$refs['virtual-viewPort'].removeEventListener('scroll', this.on_scroll)
  },
  methods: {
    installVirtualData() {
      // 通过开启宏任务 尝试去拿到真实dom 列表的高度
      let preListHeight = -1
      const loop = () => {
        const { clientHeight, scrollHeight, offsetHeight } = this.$refs['virtual-list-box']
        return Math.max(clientHeight, scrollHeight, offsetHeight)
      }
      const timer = setInterval(() => {
        const clientHeight = loop()
        if (clientHeight === preListHeight) {
          this.size = Math.ceil(clientHeight / this.keepTotals)
          this.init()
          clearInterval(timer)
        }
        preListHeight = clientHeight
      }, 0)
    },
    init() {
      // 根据总数和每条的大概高度设置滚动条
      this.$refs['virtual-viewPort'].style.height = this.size * this.keepTotals + 'px'
      this.$refs['virtual-scroll'].style.height = this.size * this.total + 'px'
      this.on_scroll = throttle(this.onScroll, 50)
      this.$refs['virtual-viewPort'].addEventListener('scroll', this.on_scroll, false)
      // this.$refs['virtual-viewPort'].addEventListener('scroll', this.onScroll, false)
    },
    onScroll() {
      const scrollTop = this.$refs['virtual-viewPort'].scrollTop
      const start = Math.floor(scrollTop / this.size) - this.prefetchTotal
      this.start = start > 0 ? start : 0
      if (this.start === this.preStart) return
      this.end = this.start + this.keepTotals + this.prefetchTotal
      this.preStart = this.start
      // set viewport position offset
      this.offset = this.start === 0 ? 0 : (this.start + this.prefetchTotal) * this.size
    }
  }
  // render() {
  //   const { renderTag } = this
  //   const defaultSlot = this.$slot.default
  //   return (
  //     <renderTag ref='virtual-viewPort' className='virtual-list-container' >
  //       <div ref='virtual-scroll' className='virtual-list-scroll' />
  //       <div class='virtual-list-box'>
  //         { this.virtualLists.map((item, index) => <div key={index}> {defaultSlot(item)} </div>) }
  //       </div>
  //     </renderTag>
  //   )
  // }
}
</script>

<style scoped lang="less">
.virtual-list-container{
    position: relative;
    overflow-y: scroll;
    .virtual-list-scroll{}
    .virtual-list-box{
        position: absolute;
        top:0;
        left:0;
    }
}
</style>
