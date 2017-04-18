//app.js
App({
  onLaunch: function () {

    var that = this
    wx.login({
      success: function(res){            
        if(res.code) {  
             wx.getUserInfo({
                success: function (res) {
                   that.globalData.userInfo = res.userInfo;
                   console.log(that.globalData.userInfo)
                } 
            });  

            var d = that.globalData;
            var strUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&grant_type=authorization_code';    
            wx.request({
                url: strUrl,
                data: {},
                method: 'GET',
                success: function(res){
                    that.globalData.openid = res.data.openid;
                    console.log(that.globalData.openid)
              } 
            });  
          }else {  
              console.log('获取用户登录态失败！' + res.errMsg)  
          }          
      }
    })
  },

//从微信平台获取用户信息
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData:{
    appid:"wxb1e9f107aff08a66",
    secret:"0ccd7143b59b99ae3fa50aecab312763",
    rootUrl:"http://localhost",//服务器url
    userInfo:null,//用户微信信息 
    openid:null,//微信openid    

    phone:null,//手机号
    register:false,//是否注册
    pAppId:null,//用户平台appid
    pAppKey:null,//用户平台app key 
    pUserInfo:null,//用户平台信息   
  }
})