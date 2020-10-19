const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const formatTime_zh = (timespan, flag = 1) => {
  var dateTime = getDateFormISO8601(timespan);
  timespan = dateTime.getTime();
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  /* var hour = dateTime.getHours()
   var minute = dateTime.getMinutes() */
  var now = new Date().getTime();
  var milliseconds = 0;
  var timeSpanStr;
  milliseconds = now - timespan;
  if (milliseconds <= 1000 * 60 * 1) {
    timeSpanStr = '刚刚';
  } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60)) + '分钟前';
  } else if (
    1000 * 60 * 60 * 1 < milliseconds &&
    milliseconds <= 1000 * 60 * 60 * 24
  ) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
  } else if (
    1000 * 60 * 60 * 24 < milliseconds &&
    milliseconds <= 1000 * 60 * 60 * 24 * 15
  ) {
    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
  } else {
    if (flag === 1) {
      timeSpanStr = year + '年' + month + '月' + day + '日';
    } else if (flag === 2) {
      timeSpanStr = month + '月' + day + '日';
    }
  }
  return timeSpanStr;
};
const formatTimeByDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
};

const formatTimeByDateStr = (dateStr) => {
  let date = getDateFormISO8601(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('-') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
};
const getDateFormISO8601 = (dateStr) => {
  // 修改 new Date(ISO 8601 时间,eg: 2020-07-22T10:54:14.000+0000)为 ios 支持的 2020/07/22 10:54:14
  const replace = (str) => {
    let date = str.slice(0, 10).replace(/-/g, '/');
    let time = str.slice(11, 19);
    let res = date + ' ' + time;
    return res;
  };
  let timeStr = replace(dateStr);
  let date = new Date(timeStr);
  // 修正时间偏移量 8 小时 2020/07/22 18:54:14
  date.setHours(date.getHours() + 8);
  return date;
};
/**
 * 判断数据类型
 *
 * @param {*} a
 * @returns Boolean String Array Object Function Number Undefined Null
 */
function getType(a) {
  return Object.prototype.toString.call(a).slice(8, -1);
}

function extend(target) {
  for (var i = 1, len = arguments.length; i < len; i++) {
    for (var prop in arguments[i]) {
      if (arguments[i].hasOwnProperty(prop)) {
        target[prop] = arguments[i][prop];
      }
    }
  }
  return target;
}

function isDef(val) {
  return val !== undefined && val !== null;
}
// console.log((new Date(dateStr)).formate("yyyy-MM-dd"))
Date.prototype.formate = function (format) {
  const o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds(),
    // millisecond
  };

  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      `${this.getFullYear()}`.substr(4 - RegExp.$1.length),
    );
  }

  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      );
    }
  }
  return format;
};

function parseCtime(str) {
  var temp = str;
  if (typeof temp === 'string') {
    temp = Number(str) * 1000;
  }
  return new Date(temp).formate('yyyy-MM-dd');
}
// 四舍五入 格式化数字
// toFix(8440.55,1) => 8440.6
function toFixed(number, fractionDigits) {
  var times = Math.pow(10, fractionDigits);
  var roundNum = Math.round(number * times) / times;
  return roundNum.toFixed(fractionDigits);
}

function toast(content, successFn) {
  wx.showToast({
    title: content,
    icon: 'none',
    success: successFn ? successFn() : function () {},
  });
}
function openLoading() {
  wx.showToast({
    title: '加载中',
    icon: 'loading',
    mask: true,
    duration: 5000,
  });
}

function closeLoading() {
  wx.hideToast();
}

// UseAge: 领取优惠券
// receive_coupons: util.debounce(function (e) {
//     var that = this;
//     // func
// }, 1000, true)
/**
 *  防抖
 * @param {*} func
 * @param {*} wait
 * @param {*} immediate Boolean 为 true 首次执行
 * @returns
 */
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var canApply = !timeout;
      timeout = setTimeout(function () {
        timeout = null; // 在 wait 时间后防抖函数才可以再次被触发
      }, wait);
      if (canApply) func.apply(context, args); // 第一次 !undefined 执行
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  };
}

// 验证规则
const VerificationRules = {
  empty: function (str) {
    return (
      str == null ||
      str == '' ||
      str == undefined ||
      typeof str == typeof undefined
    );
  },
  email: function (str) {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
  },
  phone: function (str) {
    // 碰到 16* 开头的手机号 update
    return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
  },
  tel: function (str) {
    return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
  },
  number: function (str) {
    return /^[0-9]$/.test(str);
  },
  english: function (str) {
    return /^[a-zA-Z]+$/.test(str);
  },
  allChinese: function (str) {
    return /^[\u4E00-\u9FA5]+$/.test(str);
  },
  hasChinese: function (str) {
    return /^[\u4E00-\u9FA5]/.test(str);
  },
  pwd_normal: function (str) {
    // 同时含有数字和字母，且长度要在8-16位之间
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(str);
  },
  IDCard: function (str) {
    // (15位、18位数字)，最后一位是校验位，可能为数字或字符X
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
  },
};
/**
 * 按类型校验字符串
 *
 * @param {*} str
 * @param {*} type
 * @returns
 */
function checkType(str, type) {
  return VerificationRules[type](str);
}

function throttle(fn, gapTime = 1500) {
  let _lastTime = null;
  // 返回新的函数
  return function () {
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments); //将this和参数传给原函数
      _lastTime = _nowTime;
    }
  };
}

const omit = (obj = {}, props = []) => {
  if (!Array.isArray(props)) {
    throw Error('props type error!');
  }
  const keys = Object.keys(obj);
  const res = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];
    if (!props || !props.includes(key)) {
      res[key] = value;
    }
  }
  return res;
};

const only = (obj, keys) => {
  obj = obj || {};
  if ('string' == typeof keys) keys = keys.split(/ +/);
  return keys.reduce(function (ret, key) {
    if (null == obj[key]) return ret;
    ret[key] = obj[key];
    return ret;
  }, {});
};
/**
 * 数组对象根据某一个相同的键去重
 *
 * @param {*} arr
 * @param {*} name 去除所有数组子项与此key值重复项
 * @returns
 */
function uniqueArrayObj(arr, name) {
  var obj = {};
  return arr.filter((v) => {
    if (!obj[v[name]]) {
      obj[v[name]] = true;
      return v;
    }
  });
}

// 获取视图dom元素信息
function getEle(domStr, callback) {
  const query = wx.createSelectorQuery();
  query.select(domStr).boundingClientRect();
  query.selectViewport().scrollOffset();
  query.exec(function (res) {
    callback(res);
  });
}

/**
 *
 * @desc   参数对象序列化
 * @param  {Object} obj
 * @return {String}
 */
function qsStringify(obj) {
  var pairs = [];
  for (var key in obj) {
    var value = obj[key];
    if (typeof value === 'function') {
      continue;
    }
    if (value instanceof Array) {
      for (var i = 0; i < value.length; ++i) {
        pairs.push(key + '[' + i + ']' + '=' + value[i]);
      }
      continue;
    }
    pairs.push(key + '=' + obj[key]);
  }
  return pairs.join('&');
}

function parseParam(url) {
  var paramArr = unescape(url).split('&'),
    obj = {};
  for (var i = 0; i < paramArr.length; i++) {
    var item = paramArr[i];
    if (item.indexOf('=') != -1) {
      var tmp = item.split('=');
      // unicode 解码
      obj[tmp[0]] = unescape(tmp[1]);
    } else {
      obj[item] = true;
    }
  }
  return obj;
}

function splitUserInfo(obj) {
  let data;
  if (wx.Storage.getItem('CLIENT_TYPE') === 'CLIENT_A') {
    data = wx.Storage.getItem('userInfo_Studio').agtInfo;
  } else if (wx.Storage.getItem('CLIENT_TYPE') === 'CLIENT_C') {
    data = wx.Storage.getItem('userInfo_Studio').cusInfo;
  }
  for (let item in data) {
    for (let x in obj) {
      if (item === x) {
        obj[x] = data[item];
      }
    }
  }
  return obj;
}

const deepCopy = function (obj) {
  if (typeof obj !== 'object') return;
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
};

/**
 * isContains
 * @param {*} arr
 * @param {*} current
 * @returns
 */
function isContains(arr, current) {
  if (Array.prototype.includes) {
    return arr.includes(current);
  }
  for (i = 0; i < arr.length && arr[i] != current; i++);
  return !(i == arr.length);
}

const sleep = (second) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, second * 1000);
  });
};

const trim = (str) => {
  if (typeof str !== 'string') {
    throw new Error('trim 参数需要为 String 类型');
  }
  return str.replace(/(^\s*)|(\s*$)/g, '');
};

module.exports = {
  isDef,
  getType,
  splitUserInfo,
  extend,
  getDateFormISO8601,
  formatTimeByDate,
  formatTime_zh,
  formatTimeByDateStr,
  toast,
  openLoading,
  closeLoading,
  parseCtime,
  checkType,
  toFixed,
  debounce,
  throttle,
  uniqueArrayObj,
  getEle,
  omit,
  only,
  qsStringify,
  parseParam,
  deepCopy,
  isContains,
  sleep,
  trim,
};
