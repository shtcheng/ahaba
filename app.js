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
    });   
  },

  globalData:{
    appid:"wxb1e9f107aff08a66",
    secret:"0ccd7143b59b99ae3fa50aecab312763",
    userInfo:null,
    openid:null
  }
})