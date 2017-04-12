//index.js
//获取应用实例
var app = getApp()

var showBind = false;//控制是否显示绑定页面
var showProto = false;//控制显示注册协议
var showIndex = false;//控制显示首页

Page({
  
  //获取验证码
  getCode: function() {
    console.log("getCode")
  },
  //验证
  checkPhone: function() {
    console.log("checkPhone")
    this.setData({showBind:false})
    this.setData({showProto:true})
    this.setData({showIndex:false})  
  },

  //接受协议
  confirmProto : function(){
    this.setData({showBind:false})
    this.setData({showProto:false})
    this.setData({showIndex:true})  
  },

  onLoad: function () {
    console.log('onLoad') 
    //从服务器拉去数据
    this.setData({showBind:true})
    this.setData({showProto:false})
    this.setData({showIndex:false})    
  }
})
