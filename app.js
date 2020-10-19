import mixin from '/utils/mixin';
import mixin_canvas from '/utils/mixin_canvas';
import Storage from '/utils/modules/storage';
import Event from '/utils/modules/event';
const utils = require('/utils/util');
//app.js
const app = getApp();

App({
  onLaunch: function () {
    // 注册 storage
    wx.Storage = Storage;
    // 注册发布订阅模式
    wx.Event = Event;
    // app 扩展全局公共方法
    utils.extend(this, { ...mixin, ...mixin_canvas });

    wx.getSystemInfo({
      success: (e) => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.screenWidth = e.screenWidth;
        this.globalData.screenHeight = e.screenHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar =
            capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 80;
        }
      },
    });
    // Promise 扩展
    Promise.all__fake = (promiseAry) => {
      return new Promise((resolve, reject) => {
        let resultAry = [],
          index = 0;
        for (let i = 0; i < promiseAry.length; i++) {
          Promise.resolve(promiseAry[i])
            .then((result) => {
              index++;
              resultAry[i] = result;
              if (index === promiseAry.length) {
                resolve(resultAry);
              }
            })
            .catch((reason) => {
              reject(reason);
            });
        }
      });
    };
    // 所有的 promise 都错误才触发 reject
    Promise.every = (promiseAry) => {
      // 所有的 promise 都错误才触发 reject
      return new Promise((resolve, reject) => {
        let resultAry = [],
          errorAry = [],
          index = 0,
          index__error = 0;
        for (let i = 0; i < promiseAry.length; i++) {
          Promise.resolve(promiseAry[i])
            .then((result) => {
              index++;
              resultAry[i] = result;
              if (
                index === promiseAry.length ||
                index + index__error === promiseAry.length
              ) {
                resolve(resultAry);
              }
            })
            .catch((reason) => {
              index__error++;
              errorAry[i] = reason;
              resultAry[i] = reason;
              // 都有都错误
              if (index__error === promiseAry.length) {
                reject(errorAry);
              }
              if (index + index__error === promiseAry.length) {
                resolve(resultAry);
              }
            });
        }
      });
    };
  },
  globalData: {
    userInfo: null,
    openId: '',
    CustomBar: '',
  },
});
