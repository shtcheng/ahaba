//index.js
//获取应用实例
var app = getApp()

var showBind = false;//控制是否显示绑定页面

Page({
  //获取验证码
  getCode: function() {
    console.log("getCode")
  },
  //验证
  checkPhone: function() {
    console.log("checkPhone")
  },

  onLoad: function () {
    console.log('onLoad')    
  }
})
