//logs.js
var app = getApp()

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.loadChannelInfo();
  },
  
  //跳转到用户中心
  goToUserCenter: function () {
    wx.navigateTo({
      url: '../user/user',
      success: function (res) { }
    })
  },


  //充值按钮事件处理
  chargeTap: function () {
    wx.navigateTo({
      url: '../charge/charge'
    })
  },

  //扫描二维码，获取游乐园信息编码及通道编码
  scanqrcode: function () {

    wx.scanCode({
      success: (res) => {
        console.log("扫描二维码 success")
        console.log(res)
        var prex = app.globalData.rootUrl;// +"/qrcode?";
        var str = res.result.substring(0, prex.length);
        if (str == app.globalData.rootUrl) {
          str = res.result.substring()
          wx.navigateTo({
            url: '../index/index'
          })
        } else {
          wx.showToast({
            title: '不符合规则的二维码，请选择正确的二维码进行扫描！',
            image: '../../image/info.png',
            duration: 3000
          })
        }
        return;
      },

      fail:(res) => {

      },

      complete:(res) => {

      }
    })
  },  


  //测试，获取通道最新售出票的信息
  loadChannelInfo: function () {
    var that = this;
    var strUrl2 = app.globalData.rootUrl + '/getdata?query=ticket&parkcode=' + app.globalData.parkcode + '&itemcode=' + app.globalData.itemcode;
    console.log("测试，获取通道最新售出票的信息");
    console.log(strUrl2);
    wx.request({
      url: strUrl2,
      data: {},
      method: 'GET',
      success: function (res) {
        if (res.data.result <= 0) {
          wx.showToast({
            title: '获取通道最新售出票的信息失败，请稍后再试！',
            image: '../../image/info.png',
            duration: 3000
          })
          return;
        }
        console.log(res);
      },

      fail: function (res) {
        if (res.data.result <= 0) {
          wx.showToast({
            title: '获取通道最新售出票的信息失败，请稍后再试！',
            image: '../../image/info.png',
            duration: 3000
          })
          return;
        }
      }
    });
  },


})
