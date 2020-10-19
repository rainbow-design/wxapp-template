// components/videoPlay/videoPlay.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coverURL: String,
    videoId: String,
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    backPage() {
      wx.navigateBack({
        delta: 1,
      });
    },
    showModal() {
      console.log(1);
    },
    hideModal() {
      this.setData(
        {
          display: false,
        },
        () => {
          this.triggerEvent('clear');
        },
      );
    },
  },
});
