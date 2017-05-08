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
            console.log("openid");
            console.log(that.globalData.openid)
          }
        });

        // pAppKey
        var strUrl2 = that.globalData.rootUrl+'/appkey?appid='+that.globalData.pAppId;

        wx.request({
          url: strUrl2,
          data: {},
          method: 'GET',
          success: function(res){
            console.log("get appkey success");
            var d = JSON.parse(res.data.data);
            that.globalData.pAppKey = d.key;
            console.log(that.globalData.pAppKey);
          },

          fail:function(res) {
            console.log("appkey fail");

          },
          complete:function(res) {
            console.log("appkey complete");

          }
        });

      }
    });
  },

  globalData:{
    appid:"wxb1e9f107aff08a66",
    secret:"0ccd7143b59b99ae3fa50aecab312763",
    rootUrl:"https://iland.cc",//服务器url
    userInfo:null,//用户微信信息 
    openid:"",

    storage_Phone : "phone",
    storage_MyTicket : "myTicket",
    storage_ParkCode : "parkcode",

    parkcode: "0001",//游乐场
    phone:"",//手机号
    pAppId:"cpp.7f0ef3584bd58f14891ca3646378",//用户平台appid
    pAppKey:"",//用户平台app key 
    pUserInfo:null,//用户平台信息
  }
})