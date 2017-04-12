//index.js
//获取应用实例
var app = getApp()

var showBind = false;//控制是否显示绑定页面

Page({
  data: {  
    navbar: ['首页', '搜索', '我'],  
    currentTab: 0  
  },  
  navbarTap: function(e){  
    this.setData({  
      currentTab: e.currentTarget.dataset.idx  
    })  
  } , 
  //获取验证码
  getCode: function() {
    console.log("getCode")
  },
  //验证
  checkPhone: function() {
    console.log("checkPhone")
    wx.navigateTo({
      url: '../protocol/protocol'
    })
  },

  onLoad: function () {
    console.log('onLoad')    
  }
})
