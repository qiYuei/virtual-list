# virtual-scroll-list

## 虚拟列表
| 参数 | 类型 | 介绍 | 默认值
| :-: | :-: | :-: | :-: |
| dataSources | Array | 数据源 | [] |
| total | Number | 数据源总数(计算滚动条高度) |  0
| keepTotals | Number | 每次渲染数目 | 10
| prefetchTotal | Number | 额外渲染数目(渲染总数=prefetchTotal+keepTotals) | 3


## 例子
```html
// template
<virtualList :data-sources="list" :total="list.length" :size="60">
      <template v-slot="{row}">
        <div class="box" :vid="row.id">
          {{ row.id }} {{ row.content }}
        </div>

      </template>
</virtualList>
```

```js
// 数据采用mock
mounted() {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        this.list = mockData
        resolve()
      }, 2000)
    })
  }
```

## 已解决
- [x] 兼容作用域插槽形式

## 待解决
- []  获取dom高度简单粗暴需要优化

