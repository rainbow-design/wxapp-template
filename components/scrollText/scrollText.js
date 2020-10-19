// components/scrollText/scrollText.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: null,
    animation: null,
    timer: null,
    duration: 15000,
    textWidth: 0,
    wrapWidth: 0,
    play: false,
  },
  ready() {
    this.reset();
    setTimeout(() => {
      this.initAnimation();
    }, 500);
  },
  detached() {
    this.destroyTimer();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 开启公告字幕滚动动画
     * @param  {String} text 公告内容
     * @return {[type]}
     */
    initAnimation() {
      // 创建一个动画实例 animation。调用实例的方法来描述动画。最后通过动画实例的 export 方法导出动画数据传递给组件的 animation 属性
      this.data.animation = wx.createAnimation({
        duration: this.data.duration,
        timingFunction: 'linear',
      });
      // 组件中使用 this.createSelectorQuery
      let query = this.createSelectorQuery();
      query.select('.content-box').boundingClientRect();
      query.select('#text').boundingClientRect();
      query.exec((rect) => {
        console.log('rect', rect);
        this.setData(
          {
            wrapWidth: rect[0].width,
            textWidth: rect[1].width,
          },
          () => {
            this.startAnimation();
          },
        );
      });
    },
    reset() {
      this.data.animation = wx.createAnimation({
        duration: this.data.duration,
        timingFunction: 'linear',
      });
      const resetAnimation = this.data.animation
        .translateX(300)
        .step({ duration: 0 });
      this.setData({
        animationData: resetAnimation.export(),
      });
    },
    // 定时器动画
    startAnimation() {
      // 滚动文字从右侧进入 start
      const resetAnimation = this.data.animation
        .translateX(this.data.wrapWidth)
        .step({ duration: 0 });
      this.setData({
        animationData: resetAnimation.export(),
      });
      // 开始动画（执行一次）
      const animationData = this.data.animation
        .translateX(-this.data.textWidth)
        .step({ duration: this.data.duration });
      setTimeout(() => {
        this.setData({
          animationData: animationData.export(),
        });
      }, 100);

      // 循环动画
      const timer = setTimeout(() => {
        this.startAnimation();
      }, this.data.duration);

      this.setData({
        timer,
      });
    },
    destroyTimer() {
      if (this.data.timer) {
        clearTimeout(this.data.timer);
        this.setData({ timer: null });
      }
    },
  },
});
