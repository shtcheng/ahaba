//index.js
//获取应用实例
var app = getApp();
Page({
   data: {
    page:0,
    pnum:15,

    loadingTicket: false,

    hasMore:true,
    tickets:[]
  },
  goToRegister: function(){
    wx.navigateTo({
      url: '../register/register',
      success: function(res){}
    })
  },
  goToUserCenter: function(){
    wx.navigateTo({
      url: '../user/user',
      success: function(res){}
    })
  },

  hiddenAll: function(){
    var that = this
    that.setData({
        hidden: true
    })
  },

  setColor : function(tickets){
    for(var i = 0; i < tickets.length; i++){
      if (i % 2 == 0){
        tickets[i].colorInfo = "#5D9CEC"
        tickets[i].colorAdd = "#5D9CEC"
        tickets[i].colorPrice = "#4B89DE"
      }else{
        tickets[i].colorInfo = "#49D1AD"
        tickets[i].colorAdd = "#49D1AD"
        tickets[i].colorPrice = "#35BD99"
      }
    }
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
              that.setColor(res.msg)
              that.setData({                
                ticketList : that.tickets.concat(res.msg),
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
  onReachBottom: function() {
      var that = this
      if (!that.data.hasMore) 
        return
      that.loadTicket()
  },
  //刷新处理
  onPullDownRefresh: function(e) {
      var that = this
      //数据重置
      that.data.page = 0
      that.data.ticket = []
      that.data.hasMore = true

      var d = new Date();
      var strNow = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); 
      that.setData({
        nowDate:strNow
      })

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
    var d = new Date();
    var strNow = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); 
    //动画显示
    that.setData({
      hidden : false,
      hiddenIndex:true,
      nowDate:strNow
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

                    //测试数据
                    that.setData({
                        hiddenIndex:false
                    });
                    for(var i = 0; i < 3; i++){
                      var tmp = {}
                      tmp.id = i + 1
                      tmp.name = "水上世界"
                      tmp.addr = "泸州游乐园"
                      if (i %2 == 0){
                        tmp.type = "成人票"
                      }else{
                        tmp.type = "儿童/老人票"
                      }
                      
                      tmp.money = 80
                      tmp.bgTime = "8:00"
                      tmp.endTime = "18:00"
                      that.data.tickets.push(tmp) 
                    }
                    that.setColor(that.data.tickets)
                    that.setData({
                      ticketList:that.data.tickets
                    });
                    console.log(that.data.tickets)

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
                          //app.globalData.phone = that.data.phone
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
