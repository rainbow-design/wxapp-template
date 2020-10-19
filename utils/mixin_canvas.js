import regeneratorRuntime from './runtime';
const API = require('../api/index');
const util = require('./util');
const obj = {
  // 长按图片显示识别小程序码
  // <image src='{{img}}' show-menu-by-longpress='true'  bindtap='imgshows'></image>
  // wx.previewImage
  // 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
  getCode(obj) {
    const { accountId } = wx.Storage.getItem('userInfo_Studio').agtInfo;
    let scene; // 分享携带的参数
    //isShare=articleDetail&id=' +articleId +'&accountId=' + accountId,
    if (obj) {
      scene = `a=${accountId}&id=${obj.id}&t=${obj.type}`;
    } else {
      scene = `a=${accountId}`;
    }
    const params = {
      page: 'pages/auth_login/auth_login',
      width: '40',
      scene: scene,
    };
    return new Promise((resolve, reject) => {
      API.getQRCodeShare(params).then((res) => {
        resolve(res.data.data);
      });
    });
  },
  downloadFile(onLineUrl) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: onLineUrl,
        success: (res) => {
          resolve(res.tempFilePath);
        },
      });
    });
  },
  // 比例尺    Width: 265, Height: 424
  async drawPersonalCard(content, GetTempFilePathCallback) {
    wx.showLoading({
      title: '绘制中...',
    });
    const codeUrl__onLine = await this.getCode();
    const codeUrl = await this.downloadFile(codeUrl__onLine);
    const bg = await this.downloadFile(
      'https://uatxfej.fostar.com.cn/public/person_bg.png',
    );
    let avatar;
    // 绘制名片没有个人头像，这里使用默认头像
    if (!content.avatar) {
      console.log('使用默认头像');
      avatar = '../../../assets/logo.png';
    } else {
      avatar = await this.downloadFile(content.avatar);
    }
    console.log('temp file url:', codeUrl);

    const ctx = wx.createCanvasContext('myCanvas');
    ctx.drawImage(bg, 0, 0, 265, 424);
    ctx.save(); // 先保存状态 已便于画完圆再用
    ctx.beginPath(); //开始绘制
    let avatarurl_width = 66, //绘制的头像宽度
      avatarurl_heigth = 66, //绘制的头像高度
      avatarurl_x = 100, //绘制的头像在画布上的位置
      avatarurl_y = 42; //绘制的头像在画布上的位置

    const FontStyles = (num) => {
      return 'normal normal ' + num + 'px sans-serif';
    };

    ctx.save(); // 先保存状态 已便于画完圆再用
    ctx.beginPath(); //开始绘制
    //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    ctx.arc(
      avatarurl_width / 2 + avatarurl_x,
      avatarurl_heigth / 2 + avatarurl_y,
      avatarurl_width / 2,
      0,
      Math.PI * 2,
      false,
    );
    ctx.clip(); //画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    ctx.drawImage(
      avatar,
      avatarurl_x,
      avatarurl_y,
      avatarurl_width,
      avatarurl_heigth,
    );
    ctx.save(); // 先保存状态 已便于画完圆再用
    ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制
    ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制
    ctx.font = FontStyles(10);
    let position_width = Math.ceil(ctx.measureText(content.position).width);
    console.log(position_width);
    // 用户名
    ctx.setFillStyle('#333');
    ctx.font = FontStyles(14);

    let nick_width = Math.ceil(ctx.measureText(content.nickName).width);
    // 去掉职位展示
    // let Text_width = position_width + nick_width;
    let Text_width = 0 + nick_width;

    // ctx.fillText(content.nickName, (265 - Text_width) / 2 - 8, 134);
    ctx.fillText(content.nickName, (265 - Text_width) / 2, 134);
    ctx.save();
    // 职位
    /*  ctx.font = FontStyles(10);
    ctx.setFillStyle('#666');
    ctx.fillText(
      content.position,
      (265 - Text_width) / 2 + Text_width / 2 + 8,
      132,
    ); */
    // 电话
    ctx.drawImage('../../../assets/canvas/tel_bg.png', 76, 150, 112, 28);
    ctx.drawImage('../../../assets/canvas/tel.png', 89, 156, 13, 16);
    ctx.font = FontStyles(11);
    ctx.setFillStyle('#D2A36C');
    ctx.fillText(content.phone, 108, 168);
    // 欢迎问候语
    ctx.setFillStyle('#333');
    ctx.font = FontStyles(12);
    if (content.greet) {
      let hello_left = (265 - ctx.measureText(content.greet).width) / 2;
      ctx.fillText(content.greet, hello_left, 204);
    }

    // 二维码区域
    // ctx.drawImage('../../assets/canvas/qr_bg.png', 78, 224, 110, 103);
    ctx.drawImage(codeUrl, 92, 234, 80, 80);

    ctx.font = FontStyles(8);
    ctx.setFillStyle('#999');
    ctx.fillText('星福e家', 119, 337);
    // 底部
    ctx.drawImage(codeUrl, 208, 370, 40, 40);
    ctx.drawImage('../../../assets/canvas/logo_canvas.png', 18, 373, 15, 15);
    ctx.font = FontStyles(12);
    ctx.setFillStyle('#333');
    ctx.fillText('星福e家', 38, 385);

    ctx.setFillStyle('#999');
    ctx.font = FontStyles(12);
    ctx.fillText('扫描或长按二维码查看详情', 18, 404);
    ctx.draw(
      false,
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          quality: 1,
          // width*屏幕像素密度 不要设置
          /*    destWidth: 265,
          destHeight: 424, */
          canvasId: 'myCanvas',
          success(res) {
            console.log(res.tempFilePath);
            GetTempFilePathCallback(res.tempFilePath);
            wx.showToast({
              title: '绘制成功',
            });
          },
          fail: function () {
            wx.showToast({
              title: '绘制失败',
            });
          },
        });
      }, 500),
    );
  },
  // 比例尺    Width: 265, Height: 375
  drawArticleShare(GetTempFilePathCallback) {
    wx.showLoading({
      title: '绘制中...',
    });
    const ctx = wx.createCanvasContext('myCanvas');
    ctx.drawImage('../../../assets/canvas/bg2.png', 0, 0, 265, 375);
    const FontStyles = (num) => {
      return 'normal normal ' + num + 'px sans-serif';
    };
    ctx.drawImage(
      'https://uatxfej.fostar.com.cn/public/pic.jpg',
      0,
      0,
      265,
      225,
    );
    ctx.drawImage('../../../assets/canvas/mask2.png', 0, 0, 265, 225);
    ctx.save(); // 先保存状态 已便于画完圆再用
    ctx.beginPath(); //开始绘制

    // 头像说明
    let avatarurl_width = 20, //绘制的头像宽度
      avatarurl_heigth = 20, //绘制的头像高度
      avatarurl_x = 18, //绘制的头像在画布上的位置
      avatarurl_y = 230; //绘制的头像在画布上的位置

    ctx.arc(
      avatarurl_width / 2 + avatarurl_x,
      avatarurl_heigth / 2 + avatarurl_y,
      avatarurl_width / 2,
      0,
      Math.PI * 2,
      false,
    );
    ctx.clip(); //画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    ctx.drawImage(
      'https://uatxfej.fostar.com.cn/public/avatar.jpg',
      avatarurl_x,
      avatarurl_y,
      avatarurl_width,
      avatarurl_heigth,
    );
    ctx.save(); // 先保存状态 已便于画完圆再用
    ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制
    ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制
    // 分享文字

    ctx.setFillStyle('#666');
    ctx.font = FontStyles(12);
    ctx.fillText('籍莎娅分享了一篇文章', 43, 244);

    // 换行文本
    ctx.setFillStyle('#333');
    ctx.font = FontStyles(15);
    const Text =
      '项目需求写完有一段时间了，但是还是想回过来总结一下，一是对项目的回顾优化等，二是对坑的地方做个记录，避免以后遇到类似的问题。';
    var chr = Text.split(''); //这个方法是将一个字符串分割成字符串数组
    var temp = '';
    var row = [];
    // console.log(ctx.measureText('项目需求写完有一段时间了，但是还'));

    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < 230) {
        temp += chr[a];
      } else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = '';
      }
    }
    row.push(temp);

    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = '';
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < 220) {
          test += rowPart[a];
        } else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + '...'; //这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 18, 30 + b * 20 + 246, 230);
    }

    // 分享二维码区域
    ctx.drawImage(
      'https://uatxfej.fostar.com.cn/public/avatar.jpg',
      208,
      324,
      40,
      40,
    ); //
    ctx.drawImage('../../../assets/canvas/logo_canvas.png', 18, 321, 15, 15);
    ctx.font = FontStyles(12);
    ctx.setFillStyle('#333');
    ctx.fillText('星福e家', 38, 332);

    ctx.setFillStyle('#999');
    ctx.font = FontStyles(12);
    ctx.fillText('扫描或长按二维码查看详情', 18, 358);
    ctx.draw(
      false,
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          quality: 1,
          // destWidth: 265,
          // destHeight: 375,
          canvasId: 'myCanvas',
          success(res) {
            console.log(res.tempFilePath);
            GetTempFilePathCallback(res.tempFilePath);
            wx.showToast({
              title: '绘制成功',
            });
          },
          fail: function () {
            wx.showToast({
              title: '绘制失败',
            });
          },
        });
      }, 500),
    );
  },
  // 比例尺    Width: 250, Height: 445
  async drawVideoShare(content, GetTempFilePathCallback) {
    wx.showLoading({
      title: '绘制中...',
    });
    const ctx = wx.createCanvasContext('myCanvas');
    ctx.drawImage('../../../assets/canvas/bg1.png', 0, 0, 250, 445);
    const FontStyles = (num) => {
      return 'normal normal ' + num + 'px sans-serif';
    };
    let codeUrl__onLine = await this.getCode({
      type: 'playVideo',
      id: content.id,
    });
    let codeUrl = await this.downloadFile(codeUrl__onLine);
    let VideoCoverUrl = await this.downloadFile(content.coverUrl);

    console.log('temp file url:', codeUrl);
    let { avatar, nickName } = util.splitUserInfo({
      avatar,
      nickName,
    });
    let avatarUrl = await this.downloadFile(avatar);
    ctx.drawImage(VideoCoverUrl, 0, 0, 250, 297);
    ctx.drawImage('../../../assets/canvas/mask1.png', 0, 0, 250, 297);
    ctx.drawImage('../../../assets/canvas/play.png', 101, 139, 49, 49);
    ctx.save(); // 先保存状态 已便于画完圆再用
    ctx.beginPath(); //开始绘制

    // 头像说明
    let avatarurl_width = 20, //绘制的头像宽度
      avatarurl_heigth = 20, //绘制的头像高度
      avatarurl_x = 16, //绘制的头像在画布上的位置
      avatarurl_y = 300; //绘制的头像在画布上的位置

    ctx.arc(
      avatarurl_width / 2 + avatarurl_x,
      avatarurl_heigth / 2 + avatarurl_y,
      avatarurl_width / 2,
      0,
      Math.PI * 2,
      false,
    );
    ctx.clip(); //画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    ctx.drawImage(
      avatarUrl,
      avatarurl_x,
      avatarurl_y,
      avatarurl_width,
      avatarurl_heigth,
    );
    ctx.save(); // 先保存状态 已便于画完圆再用
    ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制
    ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制
    // 分享文字

    ctx.setFillStyle('#666');
    ctx.font = FontStyles(12);
    ctx.fillText(nickName + '分享了一篇文章', 43, 315);

    // 换行文本
    ctx.setFillStyle('#333');
    ctx.font = FontStyles(15);
    /* const Text =
      '项目需求写完有一段时间了，但是还是想回过来总结一下，一是对项目的回顾优化等，二是对坑的地方做个记录，避免以后遇到类似的问题。'; */
    const Text = content.content;
    var chr = Text.split(''); //这个方法是将一个字符串分割成字符串数组
    var temp = '';
    var row = [];

    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < 210) {
        temp += chr[a];
      } else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = '';
      }
    }
    row.push(temp);

    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = '';
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < 200) {
          test += rowPart[a];
        } else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + '...'; //这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 15, 30 + b * 20 + 316, 210);
    }

    // 分享二维码区域
    ctx.drawImage(codeUrl, 195, 394, 40, 40); //
    ctx.drawImage('../../../assets/canvas/logo_canvas.png', 18, 391, 15, 15);
    ctx.font = FontStyles(12);
    ctx.setFillStyle('#333');
    ctx.fillText('星福e家', 38, 402);

    ctx.setFillStyle('#999');
    ctx.font = FontStyles(12);
    ctx.fillText('扫描或长按二维码查看详情', 18, 428);
    ctx.draw(
      false,
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          quality: 1,
          // destWidth: 250,
          // destHeight: 445,
          canvasId: 'myCanvas',
          success(res) {
            console.log(res.tempFilePath);
            GetTempFilePathCallback(res.tempFilePath);
            wx.showToast({
              title: '绘制成功',
            });
          },
          fail: function () {
            wx.showToast({
              title: '绘制失败',
            });
          },
        });
      }, 500),
    );
  },
};

module.exports = obj;
