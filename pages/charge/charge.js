//user.js
//获取应用实例
var sha1 = require('../../utils/sha1.js')
var md5 = require('../../utils/md5.js')

var app = getApp();
var tmp = 2;
var tmp2 = 1;
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
        console.log("提交充值,检查code是否过期,登录态过期!重新登陆成功！！！");
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
                image: '../../image/info.png',
                duration: 3000
              })
              return
            }

            var d = JSON.parse(res);
            app.globalData.pHasMoney = d.hasmoney;


            var str = "appid=wx5f93f2b46a4fe6d8&device_info=1000&mch_id=" + d.mch_id + "&nonce_str=" + d.nonce_str +"&key=WWWilandcc20170415qazVFRwsx321PL";
            var sign = (md5.hexMD5(str)).toUpperCase();
            //调用支付
            wx.requestPayment({
              timeStamp: d.time_start,
              nonceStr: d.nonce_str,
              package: 'prepay_id=' + d.prepay_id,
              signType: 'MD5',
              paySign: sign,
              success: function (res) {
                if (res.result <= 0) {
                  console.log("调用支付 success: " + res)

                  wx.showToast({
                    title: '支付成功！',
                    image: '../../image/info.png',
                    duration: 3000
                  })

                  return
                }
              },
              fail: function (res) {
                console.log("调用支付 fail: " + res)
                wx.showToast({
                  title: '支付失败，请稍后再试！',
                  image: '../../image/info.png',
                  duration: 3000
                })
              }
            })
          },
          complete: function (res) {
            wx.hideLoading()
            console.log("获取预下单信息 complete" + res)
          },
          fail: function (res) {
            wx.hideLoading()
            console.log("获取预下单信息 fail" + res)

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
