const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件的对外属性
   */
  properties: {
    topAvatar:{
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    isHome:{
      type:Boolean,
      default:false
    },
    bgImage: {
      type: String,
      default: ''
    },
    isBackHome:{
      type:Boolean,
      default:false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      wx.navigateBack({
        delta: 1
      });
    },
    toHome(){
      wx.switchTab({
        url: '/pages/home/index',
      })
    }
  }
})
