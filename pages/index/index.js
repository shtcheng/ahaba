//index.js
//获取应用实例
var app = getApp();
Page({
   data: {
    page:0,
    pnum:15,

    loadingTicket: false,

    hasMore:true,
    tickets:[],

    hiddenNotice : false,
    hiddenMyTick : true,
    myTickets:[],
    totalNum : 0,
    totalPrice:0
  },
  //测试用
  goToRegister: function(){
    wx.navigateTo({
      url: '../register/register',
      success: function(res){}
    })
  },
  //跳转到用户中心
  goToUserCenter: function(){
    wx.navigateTo({
      url: '../user/user',
      success: function(res){}
    })
  },
  //显示购买列表
  hiddenMyTick: function(){
    var that = this
    that.data.hiddenMyTick = !that.data.hiddenMyTick
    that.setData({
      hiddenFoorter: that.data.hiddenMyTick
    })
  },
  //数量减少
  subNum:function(e){
    var that = this
    console.log(e.currentTarget.id)
  },
  //数量增加
  addNum:function(e){
    var that = this
    console.log(e.currentTarget.id)
  },
  //清空
  clearAll : function(){
    var that = this
    that.data.myTickets = []
    that.data.totalNum = 0
    that.data.totalPrice = 0
    that.data.hiddenNotice = true
    that.setData({
      totalNum: that.data.totalNum,
      totalPrice :that.data.totalPrice,
      myTicketList:that.data.myTickets,
      hiddenNotice : that.data.hiddenNotice,
    })
  },

  //隐藏
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
      hiddenNotice : that.data.hiddenNotice,
      hiddenFoorter: that.data.hiddenMyTick,
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
                    for(var i = 0; i < 5; i++){
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
                      tmp.number = i+1
                      that.data.totalNum += tmp.number
                      that.data.totalPrice += tmp.money * tmp.number
                      that.data.myTickets.push(tmp)
                    }
                    that.setColor(that.data.tickets)
                    that.setData({
                      ticketList:that.data.tickets,
                      myTicketList:that.data.myTickets,
                      totalNum:that.data.totalNum,
                      totalPrice: that.data.totalPrice
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
