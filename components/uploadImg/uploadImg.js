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
    imgArr_onLine: [],
    isContinue: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 添加图片资源
    addImg_API: function () {
      var that = this;
      const { count, imgArr, isContinue } = this.data;
      if (!isContinue) {
        that.addImg();
      } else {
        that.changeImg(0);
      }
    },
    addImg: function () {
      var that = this;
      const { count, imgArr, isContinue } = this.data;

      if (!isContinue) {
        console.log('新增');
        wx.chooseImage({
          count: count, // 默认9 一次连续选择
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            wx.getFileSystemManager().readFile({
              filePath: tempFilePaths[0],
              encoding: 'base64', //编码格式
              success: function (result) {
                let base64 = 'data:image/png;base64,' + result.data;
                that.uploadFileToServer(base64);
              },
            });
            if (imgArr.length + 1 == count) {
              that.setData({
                imgArr: imgArr.concat(tempFilePaths),
                isContinue: true,
              });
            } else {
              that.setData({
                imgArr: imgArr.concat(tempFilePaths),
              });
            }
          },
        });
      }
    },
    uploadFileToServer(file, index) {
      let that = this;
      wx.showLoading({
        title: '图片上传中...',
        mask: true,
      });
      API.imageUploadBase64(file).then((res) => {
        let onlineURL = res.data.data.url;
        let imgArr_onLine = that.data.imgArr_onLine;
        if (typeof index === 'number') {
          // 替换
          imgArr_onLine.splice(index, 1, onlineURL);
          that.triggerEvent('onPubImageURL', {
            imgUrl: imgArr_onLine,
          });
        } else {
          // 新增
          this.triggerEvent('onPubImageURL', {
            imgUrl: imgArr_onLine.concat(onlineURL),
          });
        }

        wx.hideLoading();
      });
    },
    // 替换图片
    changeImg: function (e) {
      var that = this;
      var index = typeof e === 'number' ? e : e.currentTarget.dataset.index;
      const { imgArr } = this.data;
      wx.chooseImage({
        count: 1, // 默认9 一次连续选择
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          imgArr[index] = tempFilePaths;
          that.setData({
            imgArr: imgArr,
          });
          wx.getFileSystemManager().readFile({
            filePath: tempFilePaths[0],
            encoding: 'base64', //编码格式
            success: function (result) {
              let base64 = 'data:image/png;base64,' + result.data;
              that.uploadFileToServer(base64, index);
            },
          });
        },
      });
    },
    // 删除已选图片
    closeSelectedImg: function (e) {
      let that = this;
      var index = e.currentTarget.dataset.index;
      const { imgArr } = this.data;
      let { imgArr_onLine } = this.data;
      imgArr[index] = false;
      this.setData(
        {
          imgArr: imgArr,
        },
        function () {
          imgArr_onLine.splice(index, 1);
          that.triggerEvent('onPubImageURL', {
            imgUrl: imgArr_onLine,
          });
        },
      );
    },
  },
});
