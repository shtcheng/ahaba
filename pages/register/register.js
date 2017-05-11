//获取应用实例
var sha1 = require('../../utils/sha1.js')
var app = getApp()
//倒计时
function countdown(that) {
  var second = that.data.second 
  if (second == 0) {
    that.setData({
      codeButtText: "获取" ,
      disabledGetCode:false
    });
    return;
  }
  var time = setTimeout(function(){
    that.setData({
      second: second - 1 ,
      codeButtText : second + "秒"
    });
    countdown(that);
  },1000)
}

Page({
  data: {
    timeOut:60,
    second:0,

    checkBox: false,

    phone: "",
    checkcode:"",
    check:{},
  },
  
  //电话号码输入
  getPhone : function(e){
    var that = this
    var phone = /^0?1[3|4|5|8][0-9]\d{8}$/; 
    if(!phone.test(e.detail.value)) { 
        that.setData({
          disabledGetCode:true,
        })
        return;
    } 

    //号码格式正确，获取验证码按钮可用
    that.setData({disabledGetCode:false})    
    that.data.phone = e.detail.value
  },

  //验证码输入
  inputCode: function(e) {    
    var that = this  
    that.data.checkcode = e.detail.value
  },

  //获取验证码
  getCode: function() {
    var that = this  
    that.setData({disabledGetCode:true})    
    //倒计时
    that.data.second = that.data.timeOut
    countdown(that)

    //获取验证码
    var token = sha1.hex_sha1("sendsms"+app.globalData.pAppKey+that.data.phone)
    var strUrl = app.globalData.rootUrl + "/sendsms?token=" + token + "&mobile=" + that.data.phone
    console.log("获取验证码")
    console.log(strUrl)
    wx.request({
      url: strUrl,
        data: {},
        method: 'GET',
        success: function(res){
          res = res.data
          if (res.result <= 0) {
            console.log(res)                    
            wx.showToast({
              title: '获取验证码失败，请稍后重试！',
              image: '../../image/info.png',
              duration: 3000
            })
            return
          }

          that.data.check.phone = that.data.phone
          that.data.check.code = res.data
          console.log("check code:" + that.data.check.code)
        },
        fail:function(res) {
          console.log(res)
          wx.showToast({
            title: '获取验证码失败，请稍后重试！',
            image: '../../image/info.png',
            duration: 3000
          })
        }
     });
  },  

  //提交
  submit: function(){    
    var that = this
    if (that.data.checkcode.length == 0 || that.data.phone.length == 0){
      return
    }

    if(that.data.checkcode != that.data.check.code 
      || that.data.phone != that.data.check.phone){
        console.log("error check code.")
        return
    }

    //注册或登陆
    var token = sha1.hex_sha1("reguser"+app.globalData.pAppKey+that.data.phone)
    wx.request({
        url: app.globalData.rootUrl + "/reguser?token="+token+"&mobile="+that.data.phone + 
          "&openid="+app.globalData.openid,
        data: {},
        method: 'GET',
        success: function(res){
          res = res.data
          if (res.result < 0) {
            console.log(res)
            wx.showToast({
              title: '获取验证码失败，请稍后重试！',
              image: '../../image/info.png',
              duration: 3000
            })
            return
          }

          app.globalData.phone = that.data.phone
          wx.setStorageSync(app.globalData.storage_Phone, app.globalData.phone)
          
          //返回首页
          wx.redirectTo({
            url: '../zhuye/zhuye',
            success: function(res){}
          })
        },
        fail: function (res) {
          console.log(res)
          wx.showToast({
            title: '获取验证码失败，请稍后重试！',
            image: '../../image/info.png',
            duration: 3000
          })
        }
     });
  },

  //用户协议跳转
  goToProto : function(){
    wx.navigateTo({
      url: '../proto/proto',
      success: function(res){}
    })
  },

  //用户协议选择
  listenCheckboxChange : function(e){
     var that = this  
     that.data.checkBox = !that.data.checkBox
     that.setData({
      disabledSubmit : that.data.checkBox,
     })  
  },

  onLoad: function () {
    var that = this
    that.setData({
      disabledGetCode:true,
      disabledSubmit : that.data.checkBox,
      codeButtText:"获取"
    })

    if (app.globalData.mustLogin){
      wx.setStorageSync(app.globalData.storage_Phone, "")
    }

    //获取号码缓存
    app.globalData.phone = wx.getStorageSync(app.globalData.storage_Phone)
    console.log(app.globalData.phone)
    var phone = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if (phone.test(app.globalData.phone)) {
      wx.redirectTo({
        url: '../zhuye/zhuye',
        success: function (res) { }
      })
    }  
  }
})
