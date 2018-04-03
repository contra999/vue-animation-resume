<template>
  <div class="styleEditor" ref="container">
    <div class="code" v-html="codeInStyleTag"></div>
    <pre v-html="highlightedCode"></pre>
  </div>
</template>

<script>
  import Prism from 'prismjs';
  export default {
    name: 'Editor',
    props: ['code'],
    computed: {
      highlightedCode() {
        // 利用 prismjs 代码高亮插件 将代码高亮为 css 样式
        return Prism.highlight(this.code, Prism.languages.css)
      },
      codeInStyleTag() {
        // style 标签放在非 head 标签内也生效
        // 或者使用 vue-meta 来管理 style 标签
        // TODO: 测试 vue-meta 是否会覆盖已有的 style 标签
        return `<style>${this.code}</style>`
      }
    },
    methods: {
      goBottom() {
        // 将垂直偏移量设置成很大的值, 以达到出现滚动条时直接到底部的效果
        this.$refs.container.scrollTop = 100000;
      }
    },
  }
</script>

<style scoped>
  /* 由于style标签包裹在div内部, 需要手动隐藏 */
  .code {
    display: none;
  }
</style>
