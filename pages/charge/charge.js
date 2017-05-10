//user.js
//获取应用实例
var sha1 = require('../../utils/sha1.js')

var app = getApp();
var tmp = 2;
var tmp2 = 50;
var chargeComplete = false;

Page({
  data: {
    //motto: '你好，小程序！',
    currentMoney: '0.00',
    money:100,
    phonenumber:13982196214,
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

  //提交充值按钮点击处理
  chargesubmit: function () {

    var that = this;
    console.log("提交充值!");
    chargeComplete = false;
    

    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        //登录态过期
        wx.login({
          success:function(res){
            app.globalData.loginCode = res.code;
          }
        })
      }
    })



    that.getprepayinfo();

  },

  bindHideKeyboard: function (e) {
    if (e.detail.value === '123') {
      // 收起键盘
      wx.hideKeyboard()
    }
  },



  //获取预下单信息
  getprepayinfo: function () {
    var that = this
    wx.showLoading({
    })
    var token = sha1.hex_sha1("recharge" + app.globalData.pAppKey + app.globalData.phone)
    var strUrl = app.globalData.rootUrl + "/tradeinfo?cmd=recharge&token="+token+"&mobile=" + app.globalData.phone;
    console.log("获取预下单信息")
    console.log(strUrl)

    wx.request({
      url: strUrl,
      data: { code: app.globalData.loginCode, amount: tmp*tmp2},
      method: 'POST',
      success: function (res) {
        wx.hideLoading()

        console.log("获取预下单信息success")
        res = res.data.data
        console.log(res)
        if (res.result <= 0) {
          console.log(res.message)

          wx.showToast({
            title: '获取预下单信息失败，请稍后再试！',
            image: '../../image/info.png',
            duration: 3000
          })

          return
        }

        //        var ticket = JSON.parse(res.data)
        //        that.data.tickets = ticket
        //        that.setColor(that.data.tickets)
        //        that.setData({
        //          ticketList: that.data.tickets,
        //        });
        //        console.log(that.data.tickets)
      },
      complete: function () {
        wx.hideLoading()
        console.log("获取预下单信息 complete")
      },
      fail:function(res) {
        wx.hideLoading()
        console.log("获取预下单信息 fail")
        
      }
    });
  },



})
