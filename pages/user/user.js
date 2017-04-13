//user.js
//获取应用实例
var app = getApp()
Page({
  data: {
    //motto: '你好，小程序！',
    userInfo: {}
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
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
