
export default {
  sleep(interval) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  },
  // 利用循环实现
  async progressivelyShowStyle(n) {
    console.log(n);
    let style = this.fullStyle[n];
    for (let i = 0; i < style.length; i++) {
      let char = style.substring(i, i + 1) || " ";
      this.currentStyle += char;
      style.substring(i - 1, i) === "\n" &&
        this.$refs.styleEditor &&
        this.$nextTick(() => this.$refs.styleEditor.goBottom());
      await this.sleep(this.interval);
    }
  },
  async progressivelyShowResume() {
    console.log('async progressivelyShowResume');
    for (let i = 0; i < this.fullMarkdown.length; i++) {
      this.currentMarkdown = this.fullMarkdown.substring(0, i + 1);
      // this.currentMarkdown = this.fullMarkdown.substring(0, this.currentMarkdown.length + 1);
      // 当前的字符(倒数第一个字符)
      // let lastChar = this.currentMarkdown[this.currentMarkdown.length - 1];
      // let lastChar = this.currentMarkdown[i];
      // let lastChar = this.currentMarkdown.slice(-1);
      // 当前字符的前一个字符(倒数第二个字符)
      // let preChar = this.currentMarkdown.slice(-2, -1);
      // let preChar = this.currentMarkdown[this.currentMarkdown.length - 2];
      let preChar = this.currentMarkdown[i - 1];
      preChar === "\n" &&
        this.$refs.styleEditor &&
        this.$nextTick(() => this.$refs.resumeEditor.goBottom());  //  nextTick 确保 dom 更新完毕(即字符换行后高度增加)
      await this.sleep(this.interval);
    }
  }
};
