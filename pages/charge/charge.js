//user.js
//获取应用实例
var sha1 = require('../../utils/sha1.js')
var md5 = require('../../utils/md5.js')

var app = getApp();
var tmp = 1;
var tmp2 = 150;
var chargeComplete = false;

Page({
  data: {
    //motto: '你好，小程序！',
    currentMoney: '0.00',
    money: 100,
    moneyvalue: '',
    phonenumber: 13982196214,
    userInfo: {}
  },


  //充值按钮事件处理
  num50: function () {
    this.setData({
      moneyvalue: 50
    })
  },

  //充值按钮事件处理
  num100: function () {
    this.setData({
      moneyvalue: 100
    })
  },
  //充值按钮事件处理
  num200: function () {
    this.setData({
      moneyvalue: 200
    })
  },

  //充值按钮事件处理
  moneyinput: function (e) {
    this.setData({
      moneyvalue: e.detail.value
    })
  },
  //提交充值按钮点击处理
  chargesubmit: function () {

    var that = this;
    tmp2 = that.data.moneyvalue

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





    //重新登陆，更新loginCode
    wx.login({
      success: function (res) {
        console.log("提交充值,检查code是否过期,登录态过期!重新登陆成功！！！" + res.errMsg);
        app.globalData.logincode = res.code;


        //获取预下单信息
        var token = sha1.hex_sha1("recharge" + app.globalData.pAppKey + app.globalData.phone)
        var strUrl = app.globalData.rootUrl + "/tradeinfo?cmd=recharge&token=" + token + "&mobile=" + app.globalData.phone;
        console.log("获取预下单信息")
        console.log(strUrl)
        console.log("POST DATA:")
        console.log("code:" + app.globalData.logincode + ",amount:" + tmp * tmp2)

        wx.request({
          url: strUrl,
          data: { code: app.globalData.logincode, amount: tmp * tmp2 },
          method: 'POST',
          success: function (res) {
            wx.hideLoading()

            //获取预下单信息成功
            console.log("获取预下单信息success")
            console.log(res)
            res = res.data.data
            if (res.result <= 0) {
              console.log(res.message)

              wx.showToast({
                title: '获取预下单信息失败，请稍后再试！',
                image: '../../image/icon_error.png',
                duration: 3000
              })
              return
            }

            var d = JSON.parse(res);
            app.globalData.pHasMoney = d.hasmoney;


            var ttt = Date.now().toString();
            var nonce = d.nonce_str;
            var pkg = "prepay_id="+d.prepay_id;
            var str = "appId=wx5f93f2b46a4fe6d8"+"&nonceStr="+nonce+"&package="+pkg+"&signType=MD5&timeStamp="+ttt+"&key=WWWilandcc20170415qazVFRwsx321PL";
            var sign = (md5.hexMD5(str)).toUpperCase();
            //调用支付

            console.log("调用支付")
            console.log("调用支付")
            console.log("调用支付")
            console.log("调用支付, str:"+str)
            console.log("调用支付, appid=wx5f93f2b46a4fe6d8")
            console.log("调用支付, nonceStr="+nonce)
            console.log("调用支付, pkg="+pkg)
            console.log("调用支付, signType=MD5")
            console.log("调用支付, timeStamp="+ttt)
            console.log("调用支付, key=WWWilandcc20170415qazVFRwsx321PL")
            console.log("调用支付, paySign="+sign)


            wx.requestPayment({
              timeStamp:ttt,
              nonceStr:nonce,
              package:pkg,
              signType:"MD5",
              paySign:sign,
              success: function (res) {
                console.log("requestPayment success: " + res.errMsg)
                if (res.result <= 0) 
                {
                  wx.showToast({
                    title: '支付成功！',
                    image: '../../image/icon_error.png',
                    duration: 3000
                  })

                  return
                }
              },
              fail: function (res){
                console.log("requestPayment fail: " + res.errMsg)
                if ("requestPayment:fail cancel" != res.errMsg) {
                  wx.showToast({
                    title: '支付失败，请稍后再试！',
                    image: '../../image/icon_error.png',
                    duration: 3000
                  })
                }
              },
              complete: function (res) {
                console.log("requestPayment complete: " + res.errMsg)

              }
            })
          },
          complete: function (res) {
            wx.hideLoading()
            console.log("获取预下单信息 complete" + res)
          },
          fail: function (res) {
            wx.hideLoading()
            console.log("获取预下单信息 fail" + res.message)
          }
        });
      }
    })
  },
  //初始化
  onLoad: function () {
    var that = this
    this.setData({
      money: tmp * tmp2,
      phonenumber: app.globalData.phone
    })
  }


})
