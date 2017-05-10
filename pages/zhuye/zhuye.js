//logs.js
var app = getApp()

Page({
  data: {
    logs: []
  },
  onLoad: function () {
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

  //扫描二维码
  scanqrcode: function () {

    wx.scanCode({
      success: (res) => {
        console.log("扫描二维码 success")
        console.log(res)
        var str = res.result.substring(0, app.globalData.rootUrl.length);
        if (str == app.globalData.rootUrl) {
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

  
})
