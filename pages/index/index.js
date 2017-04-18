//index.js
//获取应用实例
var app = getApp();
Page({
   data: {
    page:0,
    pnum:10,

    loadingTicket: false,

    hasMore:false,
    ticket:[]
  },

  hiddenAll: function(){
    var that = this
    that.setData({
        hidden: true
    })
  },

  //加载商品
  loadTicket : function(){
    var that = this
    if (that.data.loadingTicket){
      return
    }

    wx.request({
          url: app.globalData.rootUrl + '/getTicket?page='+(that.data.page++)+'&pnum='+that.data.pnum,
          data: {},
          method: 'GET',
          success: function(res){
            if (res.status != 0) {
              console.log(res)
              return
            }
            if (res.msg.length == 0){
              that.data.hasMore = false
            }else{
              that.data.hasMore = true
              that.setData({
                ticket : that.ticket.concat(res.msg),
              });
            }
          },
          fail: function() {
            that.data.page--
          },
          complete: function() {
            that.hiddenAll()
            that.data.loadingTicket = false
          }
      });
  },
  //加载更多
  loadMore: function(e) {
      var that = this
      if (!that.data.hasMore) 
        return
      //动画显示      
      that.setData({
        hidden:false
      });      

      that.loadTicket()
  },
  //刷新处理
  refesh: function(e) {
      var that = this
      //数据重置
      that.data.page = 0
      that.data.ticket = []
      //动画显示
      that.setData({
          hidden:false
      });
      
      that.loadTicket()
  },

  //控制是否显示商品
  onShow: function() {
      if(app.globalData.register){
        that.setData({
          hiddenIndex:false
        });
      }
  },

  //初始化
  onLoad: function () {
    var that = this
    //动画显示
    that.setData({
      hidden : false,
      hiddenIndex:true
    })
    //微信登陆
    wx.login({
      fail: function() {
        that.hiddenAll()           
      },
      success: function(res){            
        if(res.code) {  
            //获取用户信息
             wx.getUserInfo({
                success: function (res) {
                   app.globalData.userInfo = res.userInfo;
                   console.log(app.globalData.userInfo)
                },
                fail: function() {
                  that.hiddenAll()
                }
            });  

            var d = app.globalData;
            var strUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&  grant_type=authorization_code';
            //获取openid
            wx.request({
                url: strUrl,
                data: {},
                method: 'GET',
                fail: function() {
                  that.hiddenAll()           
                },
                success: function(res){
                    app.globalData.openid = res.data.openid;
                    console.log(app.globalData.openid)

                    //是否绑定手机
                    wx.request({
                      url: app.globalData.rootUrl + "/checkBind?openid="+app.globalData.openid,
                      data: {},
                      method: 'GET',
                      fail: function() {
                        that.hiddenAll()           
                      },
                      success: function(res){
                        //拉取商品信息
                        that.loadTicket()

                        if (0 == res.msg){
                          wx.navigateTo({
                            url: 'pages/register/register',
                            success: function(res){}
                          })
                        }else{
                          app.globalData.register = true
                          that.setData({
                            hiddenIndex:false
                          });
                        }
                      } 
                  });
              }
            });  
          }else {
              console.log(res.errMsg)             
              that.hiddenAll()           
          }          
      }
    });
  }
})
