const util = require('/util');
const RootUrl = 'https://wxapp-template/wx'; // dev

let ERROR_NUM = 0;

const http = (
  url,
  data = {},
  method,
  contentType = 'application/x-www-form-urlencoded',
  custom_post = false,
) => {
  const config__header = {
    'x-tenant-header': 'web-spcloud-sales',
    'Content-Type': contentType,
  };
  const token = wx.getStorageSync('ACCESS_TOKEN') || '';
  // 设置参数 {token: false},可以不设置授权 header 头
  if (token && data.token === undefined) {
    config__header['Authorization'] = 'Bearer ' + token;
  }
  if (data.token === false) {
    delete data.token;
  }

  if (custom_post) {
    data = util.qsStringify(data);
  }

  return new Promise(function (resolve, reject) {
    wx.request({
      url: RootUrl + url,
      data: data,
      method: method,
      header: config__header,
      success: (res) => {
        if (res.statusCode == 200) {
          // wx.showLoading({
          //   title: '加载中',
          // })
          // console.log('Request Successful', {
          //   url,
          //   params: data,
          //   result: res,
          // });
          resolve(res);
        } else {
          console.log('Request Error', {
            url,
            params: data,
            result: res,
          });

          // token 已经失效

          ERROR_NUM++;

          if (
            res.data &&
            res.data.resp_msg &&
            res.data.resp_msg.indexOf('Invalid access token') !== -1 &&
            ERROR_NUM === 1
          ) {
            wx.showModal({
              title: '警告',
              showCancel: false,
              content: '登录信息已经失效，请重新进行登陆认证！',
              confirmText: '确定',
              success: (res) => {
                if (res.confirm) {
                  wx.Storage.clear(function () {
                    console.log('重新定位到授权页');
                  });
                }
              },
            });
          }
          reject(res);
          // util.toast('服务器异常，请稍后再试');
        }
      },
      complete: () => {
        // wx.hideLoading();
      },
      fail: (err) => {
        reject(err);
        // console.log('failed --- 网络出错');
      },
    });
  });
};

const _get = (url, param = {}) => {
  return http(url, param, 'GET');
};

const _post = (url, param = {}, contentType = 'application/json') => {
  return http(url, param, 'POST', contentType);
};

const _put = (url, param = {}) => {
  return http(url, param, 'PUT');
};

const _delete = (url, param = {}) => {
  return http(url, param, 'DELETE');
};

// 参数拼接
const _post__qs = (url, param = {}) => {
  return http(url, param, 'POST', 'application/x-www-form-urlencoded', true);
};

export { _get, _post, _put, _delete, _post__qs, RootUrl };
