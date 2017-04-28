//app.js
App({
  onLaunch: function () {
    var that = this

    //微信登陆
    wx.login({
      success: function(res){  
        //用户信息
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            console.log(that.globalData.userInfo)              
          },
        });
        
        //openid
        var strUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid='+that.globalData.appid+'&secret='+that.globalData.secret+'&js_code='+res.code+'&  grant_type=authorization_code';
        wx.request({
          url: strUrl,
          data: {},
          method: 'GET',
          success: function(res){
            that.globalData.openid = res.data.openid;
            console.log(that.globalData.openid)
          }
        });
      }
    });

    //获取pAppKey
    wx.request({
      url: that.globalData.rootUrl + "/appkey?appid="+that.globalData.pAppId,
      data: {},
      method: 'GET',
      success: function(res){
        if (res.result > 0){
          var recvData = JSON.parse(res.data)
          that.globalData.pAppKey = recvData.key

          //获取号码缓存
          that.globalData.phone = wx.getStorageSync(that.globalData.storage_Phone)
          if (0 == that.globalData.phone.length){
            wx.redirectTo({
              url: 'pages/register/register',
              success: function(res){}
            })
          }else{
            wx.redirectTo({
              url: 'pages/index/index',
              success: function(res){}
            })
          }
        }
      }
    });


    //获取号码缓存  先放外面测试
          that.globalData.phone = wx.getStorageSync(that.globalData.storage_Phone)
          if (0 == that.globalData.phone.length){
            wx.redirectTo({
              url: 'pages/register/register',
              success: function(res){}
            })
          }else{
            wx.redirectTo({
              url: 'pages/index/index',
              success: function(res){}
            })
          }
  },

  globalData:{
    appid:"wxb1e9f107aff08a66",
    secret:"0ccd7143b59b99ae3fa50aecab312763",
    rootUrl:"www.iland.cc:8000",//服务器url
    userInfo:null,//用户微信信息 
    openid:"",

    storage_Phone : "phone",
    storage_MyTicket : "myTicket",

    parkcode: "",//游乐场
    phone:"",//手机号
    pAppId:"cpp.7f0ef3584bd58f14891ca3646378",//用户平台appid
    pAppKey:"",//用户平台app key 
    pUserInfo:null,//用户平台信息   
  }
})