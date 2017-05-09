//user.js
//获取应用实例
var sha1 = require('../../utils/sha1.js')
var app = getApp()
Page({
  data: {
    phoneNumber:13982196214,
    hasMoney:0,
    history:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //充值按钮事件处理
  chargeTap:function() {
    wx.navigateTo({
      url: '../charge/charge'
    })
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this;

    //获取账户信息
    var token2 = sha1.hex_sha1("account" + app.globalData.pAppKey + app.globalData.phone)
    var strUrl2 = app.globalData.rootUrl + '/account?token=' + token2 + '&mobile=' + app.globalData.phone;
    console.log("get account info");
    console.log(strUrl2);
    wx.request({
      url: strUrl2,
      data: {},
      method: 'GET',
      success: function (res) {
        if (res.data.result <= 0) {
          wx.showToast({
            title: '获取用户信息失败，请稍后再试！',
            image: '../../image/info.png',
            duration: 3000
          })
          return;
        }

        var d = JSON.parse(res.data.data);
        app.globalData.pHasMoney = d.hasmoney;
        that.setData({
          phoneNumber:app.globalData.phone,
          hasMoney: app.globalData.pHasMoney
        })
      },

      fail:function(res) {
        if (res.data.result <= 0) {
          wx.showToast({
            title: '获取账号信息失败，请稍后再试！',
            image: '../../image/info.png',
            duration: 3000
          })
          return;
        }
      }
    });
  }
})
