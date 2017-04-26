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

    buyDate:"",
    hiddenNotice : true,
    hiddenMyTick : true,
    myTickets:[],
    totalNum : 0,
    totalPrice:0
  },
  goToRegister:function(){
    wx.navigateTo({ 
      url: '../register/register',
      success: function(res){}
    })
  },
  //转到结算页面
  goToPay : function(){
    var that = this
    if (0 == that.data.myTickets.length){
      console.log("empty")
      return
    }
    wx.navigateTo({
      url: '../pay/pay?date='+that.data.buyDate,
      success: function(res){}
    })
  },
  //日期
  datePickerBindchange:function(e){
    var that = this
    that.data.buyDate = e.detail.value
    that.setData({
      nowDate: that.data.buyDate
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
  deepCopy : function(source) { 
    var result = {}
    for (var key in source) {
      result[key] = typeof source[key]==='object'? deepCoyp(source[key]): source[key];
    } 
    return result; 
  },
  calShow : function(){
    var that = this
    if (0 == that.data.myTickets.length){
      that.clearAll()
      return
    }

    that.data.totalNum = 0
    that.data.totalPrice = 0
    that.data.hiddenNotice = false
    for(var i = 0; i < that.data.myTickets.length; i++){
      that.data.totalNum += that.data.myTickets[i].number
      that.data.totalPrice += that.data.myTickets[i].number * that.data.myTickets[i].price
    }
    that.setData({
      totalNum : that.data.totalNum,
      totalPrice : that.data.totalPrice,
      myTicketList : that.data.myTickets,
      hiddenNotice : that.data.hiddenNotice,
    })
  },
  getNowDate : function(){
    var d = new Date()
    return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
  },
  //添加票
  addTicket : function(id, iNumber){
    var that = this
    var bHave = false
    //是否有
    for(var i = 0; i < that.data.myTickets.length; i++){
      if (that.data.myTickets[i].id == id) {
          bHave = true
          that.data.myTickets[i].number += iNumber
          if (that.data.myTickets[i].number <= 0){
            that.data.myTickets.splice(i, 1)
          }
          break
      }
    }

    if (!bHave && iNumber > 0){
      for(var i = 0; i < that.data.tickets.length; i++){
        if (id == that.data.tickets[i].id){
          var newTick = that.deepCopy(that.data.tickets[i])
          newTick.number = iNumber
          that.data.myTickets.push(newTick)
        }
      }
    }
    
    that.calShow()
    wx.setStorageSync('myTicket', that.data.myTickets)    
  },
  //数量减少
  subNum:function(e){
    var that = this
    that.addTicket(e.currentTarget.id, -1)
  },
  //数量增加
  addNum:function(e){
    var that = this    
    that.addTicket(e.currentTarget.id, 1)
  },
  //清空
  clearAll : function(){
    var that = this
    that.data.myTickets = []
    that.data.totalNum = 0
    that.data.totalPrice = 0
    that.data.hiddenNotice = true
    that.data.hiddenMyTick = true
    that.setData({
      totalNum: that.data.totalNum,
      totalPrice :that.data.totalPrice,
      myTicketList:that.data.myTickets,
      hiddenNotice : that.data.hiddenNotice,
      hiddenFoorter: that.data.hiddenMyTick,
    })
    wx.setStorageSync('myTicket', that.data.myTickets)
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

      that.loadTicket()
  },

  onShow: function() {
      var that = this
      if(app.globalData.register){
        that.setData({
          hiddenIndex:false
        });
      }

      that.data.myTickets = wx.getStorageSync('myTicket')   
      that.calShow()
  },

  //初始化
  onLoad: function () {
    var that = this
    that.data.buyDate = that.getNowDate()
    //动画显示
    that.setData({
      hidden : false,
      hiddenIndex:true,
      hiddenFoorter: that.data.hiddenMyTick,
      nowDate:that.data.buyDate,
      startDate:that.data.buyDate
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
                      tmp.itemname = "水上世界"
                      tmp.addr = "泸州游乐园"
                      if (i %2 == 0){
                        tmp.ticketname = "成人票"
                      }else{
                        tmp.ticketname = "儿童/老人票"
                      }
                      
                      tmp.price = 80
                      tmp.dt_open = "8:00"
                      tmp.dt_close = "18:00"
                      that.data.tickets.push(tmp) 
                    }
                    that.setColor(that.data.tickets)
                    that.setData({
                      ticketList:that.data.tickets,
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
                            url: '../register/register',
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
