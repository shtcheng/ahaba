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

    that.loadAccountInfo();
    that.loadHistory();
  },

  //获取账户信息
  loadAccountInfo:function() {
    var that = this;
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
          phoneNumber: app.globalData.phone,
          hasMoney: app.globalData.pHasMoney
        })
      },

      fail: function (res) {
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
  },


  setColor: function (history) {
    for (var i = 0; i < history.length; i++) {
      if (i % 2 == 0) {
        history[i].itembgcolor222 = "#5D9CEC"
      } else {
        history[i].itembgcolor222 = "#ff0000"
      }
    }
  },

  //加载商品
  loadHistory: function () {
    var that = this

    var strUrl = app.globalData.rootUrl + "/getdata?query=order&mobile=" + app.globalData.phone;
    console.log("历史购票信息")
    console.log(strUrl)
    wx.request({
      url: strUrl,
      data: {},
      method: 'GET',
      success: function (res) {
        console.log("历史购票信息")
        res = res.data
        console.log(res)
        if (res.result <= 0) {
          console.log(res)

          wx.showToast({
            title: '获取购票历史信息失败，请稍后再试！',
            image: '../../image/info.png',
            duration: 3000
          })

          return
        }


        var ticket = JSON.parse(res.data)
        that.data.history = ticket
//        that.setColor(that.data.history)        
        console.log("background color")
        console.log(that.data.history)
        that.setData({
          history: that.data.history,
        });
      },
      complete: function () {
        wx.hideLoading()
      }
    });
  },

})
