// comments/uploadImg/uploadImg.js
import API from '../../api/index';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count: Number, // 允许上传图片的总数
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgArr: [],
    videoArr_onLine: [],
    isContinue: false,
    duration: null, // 视频时间
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 添加图片资源
    addImg: function () {
      var that = this;
      const { count, imgArr, isContinue } = this.data;

      if (!isContinue) {
        // https://developers.weixin.qq.com/miniprogram/dev/api/media/video/wx.chooseVideo.html
        wx.chooseVideo({
          count: count, // 默认9 一次连续选择
          sourceType: ['album', 'camera'],
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePath;

            that.uploadFileToServer(tempFilePaths);
            if (imgArr.length + 1 == count) {
              that.setData({
                imgArr: imgArr.concat(tempFilePaths),
                isContinue: true,
                duration: res.duration,
              });
            } else {
              that.setData({
                imgArr: imgArr.concat(tempFilePaths),
                duration: res.duration,
              });
            }
          },
          fail: function (err) {
            console.log(err);
          },
        });
      }
    },
    uploadFileToServer(file, index) {
      let that = this;
      wx.showLoading({
        title: '视频上传中...',
        mask: true,
      });
      wx.uploadFile({
        url: API.uploadVideo,
        filePath: file,
        header: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        name: 'file',
        success(res) {
          // 服务器上传好的图片真实路径
          const videoId = JSON.parse(res.data).data.videoId;
          const { videoArr_onLine, duration } = that.data;
          if (typeof index === 'number') {
            // 替换
            videoArr_onLine.splice(index, 1, videoId);
            that.triggerEvent('onPubVideoURL', {
              videoUrl: videoArr_onLine,
              duration: duration,
            });
          } else {
            // 新增
            that.triggerEvent('onPubVideoURL', {
              videoUrl: videoArr_onLine.concat(videoId),
              duration: duration,
            });
          }
          wx.hideLoading();
        },
      });
    },
    // 替换图片
    changeImg: function (e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      const { imgArr } = this.data;
      wx.chooseVideo({
        count: 1, // 默认9 一次连续选择
        sourceType: ['album', 'camera'],
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePath;
          imgArr[index] = tempFilePaths;
          that.setData({
            imgArr: imgArr,
            duration: res.duration,
          });
          that.uploadFileToServer(tempFilePaths, index);
        },
        fail: function (err) {
          console.log(err);
        },
      });
    },
    // 删除已选图片
    closeSelectedImg: function (e) {
      let that = this;
      var index = e.currentTarget.dataset.index;
      const { imgArr } = this.data;
      let { videoArr_onLine } = this.data;
      imgArr[index] = false;
      this.setData(
        {
          imgArr: imgArr,
          duration: null,
        },
        function () {
          videoArr_onLine.splice(index, 1);
          that.triggerEvent('onPubVideoURL', {
            videoUrl: videoArr_onLine,
          });
        },
      );
    },
  },
});
