// colorui/components/loadProgress/loadProgress.js
const app = getApp();


Component({
  options: {
   addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    progress: {
      type: Number,
      observer: function (newVal, oldVal) {
        if (newVal === 100) {
          wx.nextTick(() => {
            this.setData({
              loadProgress: 100
            }) // 在当前同步流程结束后，下一个时间片执行
          })

        }
      }, // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadProgress: 0,
    CustomBar: app.globalData.CustomBar,
  },
  attached() {
    this.loadProgress();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadProgress(){
      this.setData({
        loadProgress: this.data.loadProgress + 3
      })
      if (this.data.loadProgress<100){
        setTimeout(() => {
          this.loadProgress();
        }, 100)
      }else{
        this.setData({
          loadProgress: 0
        })
      }
    }
  },
})
