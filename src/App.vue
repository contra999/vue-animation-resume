<template>
  <div id="app">
    <StyleEditor
      ref="styleEditor"
      :code="currentStyle"
    />
    <ResumeEditor
      ref="resumeEditor"
      :markdown="currentMarkdown"
      :enableHtml="enableHtml"
    />
  </div>
</template>

<script>
import StyleEditor from "./components/StyleEditor";
import ResumeEditor from "./components/ResumeEditor";
import "./assets/reset.css";
import { fullStyle, fullMarkdown } from "./assets/data";
import methods from './App.methods.js';

export default {
  name: "App",
  components: {
    StyleEditor,
    ResumeEditor
  },
  data() {
    return {
      interval: 40,
      currentStyle: '',
      enableHtml: false,
      fullStyle,
      currentMarkdown: '',
      fullMarkdown
    };
  },
  created() {
    this.makeResume();
  },
  methods: {
    async makeResume() {
      await this.progressivelyShowStyle(0);
      await this.progressivelyShowResume();
      await this.progressivelyShowStyle(1);
      await this.showHtml();
      await this.progressivelyShowStyle(2);
    },
    showHtml() {
      return new Promise((resolve, reject) => {
        this.enableHtml = true;
        resolve();
      });
    },
    progressivelyShowStyle(n) {
      let interval = this.interval;
      let style = this.fullStyle[n];
      if (!style) return;
      // 计算前 n 个 style 的字符总数
      let length = this.fullStyle
        .filter((_, index) => index <= n)
        .map(item => item.length)
        .reduce((total, current) => total + current, 0);
      // 每次初始调用时, prefixLength 和 this.currentStyle.length 的值相同
      let prefixLength = length - style.length;
      /**
       * await 等一个返回值, 常规的 return 语句亦可
       * 所以递归要在 new Promise 的内部(只能靠 resolve/reject 传值, return 只能用来跳出)
       * 确保 await 只能等到 resolve 而非常规的函数 return 值
       * 若简写成 return Promise.resolve() 而不是 new Promise 内的 resolve()
       * 就会导致 await 等到 return 值而提前执行 await 后的语句
       */
      return new Promise((resolve, reject) => {
        let showStyle = () => {
          if (this.currentStyle.length < length) {
            let l = this.currentStyle.length - prefixLength;
            let char = style.substring(l, l + 1) || " ";
            this.currentStyle += char;
            /**
             * 遇到换行符则滚动到底部
             * 注意判断的是当前字符的前一个
             * 意味着当前字符出现后(即便还是换行符), 前面的换行符才生效
             * div的滚动高度(实际的内容高度)才会增加, 滚动才有意义
             */
            style.substring(l - 1, l) === "\n" &&
              this.$refs.styleEditor &&
              this.$nextTick(() => this.$refs.styleEditor.goBottom());
            setTimeout(showStyle, interval);
          } else {
            resolve();
          }
        };
        showStyle();
      });
    },
    progressivelyShowResume() {
      return new Promise((resolve, reject) => {
        let length = this.fullMarkdown.length;
        let interval = this.interval;
        let showResume = () => {
          if (this.currentMarkdown.length < length) {
            this.currentMarkdown = this.fullMarkdown.substring(
              0,
              this.currentMarkdown.length + 1
            );
            let lastChar = this.currentMarkdown[
              this.currentMarkdown.length - 1
            ];
            let preChar = this.currentMarkdown[this.currentMarkdown.length - 2];
            if (preChar === "\n" && this.$refs.resumeEditor) {
              this.$nextTick(() => this.$refs.resumeEditor.goBottom());
            }
            setTimeout(showResume, interval);
          } else {
            resolve();
          }
        };
        showResume();
      });
    },
    ...methods
  }
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  min-height: 100vh;
}
* {
  box-sizing: border-box;
}
</style>
