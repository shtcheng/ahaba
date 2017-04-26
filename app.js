//app.js
App({
  onLaunch: function () {
  },

  globalData:{
    appid:"wxb1e9f107aff08a66",
    secret:"0ccd7143b59b99ae3fa50aecab312763",
    rootUrl:"http://localhost",//服务器url
    userInfo:null,//用户微信信息 
    openid:null,//微信openid    

    parkcode: null,//游乐场
    phone:null,//手机号
    register:false,//是否注册
    pAppId:null,//用户平台appid
    pAppKey:null,//用户平台app key 
    pUserInfo:null,//用户平台信息   
  }
})