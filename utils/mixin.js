const obj = {
  Toast(msg, timeStamp = 1000, fun = null) {
    var fun1 = fun ? fun : function () {};
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1500,
      mask: false,
      success: (result) => {
        setTimeout(() => {
          fun1(result);
        }, timeStamp);
      },
    });
  },
  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function (querySelect) {
    wx.createSelectorQuery()
      .select(querySelect)
      .boundingClientRect(function (rect) {
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.height,
        });
      })
      .exec();
  },
  isContinueToAuth_Visitor() {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: '提示',
        content: '您还没有权限进行当前操作，是否前往授权注册？',
        cancelText: '再看看',
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) {
            // 去授权
            resolve();
            // callback();
            // 返回上一页
            // this.back();
          } else if (res.cancel) {
            reject();
            console.log('用户点击取消');
          }
        },
      });
    });
  },
  isLogin(callback, e) {
    let token = wx.Storage.getItem('token');
    if (token === '') {
      wx.navigateTo({
        url: `/pages/auth_login/auth_login?isShouquan=false`,
      });
    } else {
      // 登录后操作
      callback.apply(undefined, e);
    }
  },
  toHref(e, params) {
    const href = e.currentTarget.dataset.href;
    wx.navigateTo({
      url: params ? `${href}?` + params : href,
    });
  },
  toHref__redirect(e, params) {
    const href = e.currentTarget.dataset.href;
    wx.redirectTo({
      url: params ? `${href}?` + params : href,
    });
  },
  // 返回上一页
  back() {
    wx.navigateBack({
      delta: 1,
    });
  },
  call(e) {
    const data = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: data.phone,
    });
  },
  getBase64(tempFilePath, callback) {
    wx.getFileSystemManager().readFile({
      filePath: tempFilePath,
      encoding: 'base64', //编码格式
      success: function (result) {
        let base64 = 'data:image/png;base64,' + result.data;
        callback(base64);
      },
    });
  },
  base64ToBlob(imageBase64) {
    let arr = imageBase64.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },
  saveImageToPhotosAlbum(canvasImgURL) {
    wx.showLoading({
      title: '保存中...',
    });
    wx.saveImageToPhotosAlbum({
      filePath: canvasImgURL,
      success: (data) => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '您的推广海报已存入手机相册，赶快分享给好友吧',
          showCancel: false,
        });
      },
      fail: function (err) {
        console.log('saveImageToPhotosAlbum err:', err);
        if (
          err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' ||
          err.errMsg === 'saveImageToPhotosAlbum:fail auth deny'
        ) {
          // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: () => {
              wx.openSetting({
                success(settingdata) {
                  console.log('settingdata', settingdata);
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击图片即可保存',
                      showCancel: false,
                    });
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    });
                  }
                },
                fail(failData) {
                  console.log('failData', failData);
                },
                complete(finishData) {
                  console.log('finishData', finishData);
                },
              });
            },
          });
        }
      },
      complete(res) {
        wx.hideLoading();
      },
    });
  },
};

module.exports = obj;
