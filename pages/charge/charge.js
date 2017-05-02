//user.js
//获取应用实例
var app = getApp();
var tmp = 2;
var tmp2 = 50;
var chargeComplete = false;

Page({
  data: {
    //motto: '你好，小程序！',
    currentMoney: '0.00',
    money:100,
    phonenumber:13730842688,
    userInfo: {}
  },


  //充值按钮事件处理
  chargeMinus: function () {
    console.log("chargeMinus pressed");
    tmp--;
    if(tmp < 1) {
      tmp = 1;
    }

    this.setData({
      money:tmp * tmp2
    })

//扫描二维码
//    wx.scanCode({
//      success: function(res) {
//        console.log(res)
//      },
//      fail: function() {
//        console.log(res)
//      },
//      complete: function(res) {
//       console.log(res)
//      }
//    })
  },
  //充值按钮事件处理
  chargeAdd: function () {
    console.log("chargeAdd pressed");

    tmp++;

    this.setData({
      money:tmp * tmp2
    })
  },

  //提交充值
  chargesubmit: function () {
    console.log("提交充值!");
    chargeComplete = false;

    wx.requestPayment({
   'timeStamp': '',
   'nonceStr': '',
   'package': '',
   'signType': 'MD5',
   'paySign': '',
   'success':function(res){
     console.log("充值成功！");
   },
   'fail':function(res){
     console.log("充值失败！");
   },
   'complete' : function(res) {
     console.log("充值操作完成！");
   }
})

  },

  bindHideKeyboard: function (e) {
    if (e.detail.value === '123') {
      // 收起键盘
      wx.hideKeyboard()
    }
  }
})
