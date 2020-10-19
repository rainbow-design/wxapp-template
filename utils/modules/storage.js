const getType = function (a) {
  return Object.prototype.toString.call(a).slice(8, -1);
};
const Storage = {
  //  第一个 key 参数可以省略，直接传递 obj 对象，支持 callback
  setItem: function (key, obj, callback) {
    const firstParamType = getType(arguments[0]);
    if (firstParamType === 'Object') {
      const keyArrayLength = Object.keys(arguments[0]).length;
      let index = 0;
      for (let keyName in arguments[0]) {
        index++;
        wx.setStorage({
          key: keyName,
          data: arguments[0][keyName],
          success: index == keyArrayLength ? arguments[1] : function () {},
        });
      }
    }
    if (firstParamType === 'String') {
      wx.setStorage({
        key: key,
        data: obj,
        success: callback || function () {},
      });
    }
  },
  getItem: function (key) {
    return wx.getStorageSync(key);
  },
  getItem__once: function (key) {
    const value = wx.getStorageSync(key);
    wx.removeStorage({
      key: key,
    });
    return value;
  },
  removeItem: function (key) {
    const firstParamType = getType(arguments[0]);
    if (firstParamType === 'Array') {
      for (let key in arguments[0]) {
        wx.removeStorage({
          key: arguments[0][key],
        });
      }
    } else {
      wx.removeStorage({
        key: key,
      });
    }
  },
  clear: function (callback) {
    wx.clearStorage({
      success: function () {
        console.log('全局缓存清除成功');
        callback ? callback() : '';
      },
    });
  },
};
module.exports = Storage;
