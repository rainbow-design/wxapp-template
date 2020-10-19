// colorui/components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    display:{
      type: Boolean,
      default:true,
    },
    background: {
      type: String,
      default: 'rgba(0, 0, 0, 0.3)',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal(e) {
      this.setData({
        display:true
      })
    },
    hideModal(e) {
      this.triggerEvent('hideModal');
      this.setData({
        display: false
      })
    },
  }
})
