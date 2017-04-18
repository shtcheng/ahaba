//获取应用实例
var app = getApp()
Page({
  data: {
  },
  
  onLoad: function () {
    var that = this  
    //加载用户协议
    wx.request({
        url: app.globalData.rootUrl + "/getAgreement",
        data: {},
        method: 'GET',
        success: function(res){
          if (res.status != 0) {
            console.log(res)
            return
          }

          that.setData({userAgreement: res.msg})
        } 
    })
  }
})
