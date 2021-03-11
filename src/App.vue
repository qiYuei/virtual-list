<template>
  <div id="app">
    <virtualList :data-sources="list" :total="list.length" :size="60">
      <template v-slot="{row}">
        <div class="box" :vid="row.id">
          {{ row.id }} {{ row.content }}
        </div>

      </template>
    </virtualList>
  </div>
</template>

<script>
import mockData from '@/mock/index'
import virtualList from '@/components/virtual-list'
export default {
  name: 'App',
  components: {
    virtualList
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    // this.list = mockData
  },
  mounted() {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        this.list = mockData
        resolve()
      }, 2000)
    })
  }
}
</script>

<style lang="less">
*{
  padding:0;
  margin:0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.box{
  box-sizing: border-box;
  padding:12px;
  border: 1px solid #cccccc;
}
</style>
