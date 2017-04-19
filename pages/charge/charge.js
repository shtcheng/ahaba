//user.js
//获取应用实例
var temp_money=0;
var app = getApp()
Page({
  data: {
    //motto: '你好，小程序！',
    currentMoney: '0.00',
    chargeMoney:100,
    userInfo: {}
  },


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //充值按钮事件处理
  btnMinusMoney: function () {
    temp_money=chargeMoney.value-100;
    if(temp_money < 0 ) {
      temp_money = 0;
    }
//    chargeMoney = temp_money;
    this.setData({
      chargeMoney:temp_money
    })
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //充值按钮事件处理
  btnAddMoney: function () {
    temp_money=chargeMoney.value+100;
//    chargeMoney = temp_money;
    this.setData({
      chargeMoney:temp_money
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
  },

  bindHideKeyboard: function (e) {
    if (e.detail.value === '123') {
      // 收起键盘
      wx.hideKeyboard()
    }
  }
})
