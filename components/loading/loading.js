Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLoading: {
      type: Boolean,
      observer: function (newVal, oldVal) {
        if (newVal === false) {
          wx.hideToast();
        }
      }, // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},
  created() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 5000,
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {},
});
