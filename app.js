//app.js
App({
  onLaunch: function () {
    console.log("App onLaunch") 
    var that = this

    //微信登陆
    wx.login({
      success: function(res){
        //用户信息
        that.globalData.logincode=res.code;
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
          }
        });

        // 游乐园信息
        var strUrl3 = that.globalData.rootUrl + '/getdata?query=park';
        wx.request({
          url: strUrl3,
          data: {},
          method: 'GET',
          success: function (res) {
            console.log("get park list success");
            console.log(res)
            that.globalData.pParks = JSON.parse(res.data.data);
            console.log("park list");
            console.log(that.globalData.pParks);
          }
        });
      }
    });
  },

  globalData:{
    mustLogin:false,
    appid:"wxb1e9f107aff08a66",
    secret:"0ccd7143b59b99ae3fa50aecab312763",
    rootUrl:"https://iland.cc",//服务器url
    userInfo:null,//用户微信信息 
    openid:"",
    logincode:null,

    storage_Phone : "phone",
    storage_MyTicket : "myTicket",
    storage_ParkCode : "parkcode",

    parkcode: "0001",//游乐场编号
    itemcode:"0001",//游乐项目编号
    phone:"",//手机号
    pAppId:"cpp.7f0ef3584bd58f14891ca3646378",//用户平台appid
    pAppKey:"",//用户平台app key 
    pUserInfo:null,//用户平台信息
    pHasMoney:null,//用户账户余额
    pParks:[],//游乐园列表
  }
})