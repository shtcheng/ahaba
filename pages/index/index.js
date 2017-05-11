//index.js
//获取应用实例
var sha1 = require('../../utils/sha1.js')
var app = getApp();
Page({
   data: {
    tickets:[],

    buyDate:"",
    hiddenNotice : true,
    hiddenMyTick : true,
    myTickets:[],
    totalNum : 0,
    totalPrice:0
  },

  //转到结算页面
  goToPay : function(){
    var that = this
    if (0 == that.data.myTickets.length){
      console.log("goToPay empty")
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
    if (app.globalData.phone.length == 0){
      wx.navigateTo({
        url: '../register/register',
        success: function(res){}
      })
      return
    }

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
      if (that.data.myTickets[i].tid == id) {
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
        if (id == that.data.tickets[i].tid){
          var newTick = that.deepCopy(that.data.tickets[i])
          newTick.number = iNumber
          that.data.myTickets.push(newTick)
        }
      }
    }
    
    that.calShow()
    wx.setStorageSync(app.globalData.storage_MyTicket, that.data.myTickets)    
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
    wx.setStorageSync(app.globalData.storage_MyTicket, that.data.myTickets)
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
    wx.showLoading({
    })

    var strUrl = app.globalData.rootUrl +  "/getdata?query=ticket&parkcode=" + app.globalData.parkcode
    wx.request({
      url: strUrl,
      data: {},
      method: 'GET',
      success: function(res){
        res = res.data
        if (res.result <= 0) {
          wx.showToast({
            title: '获取票务信息失败，请稍后再试！',
            image: '../../image/info.png',
            duration: 3000
          })
          console.log(res)
          return
        }

        var ticket = JSON.parse(res.data)
        that.data.tickets = ticket
        that.setColor(that.data.tickets)        
        that.setData({
          ticketList : that.data.tickets,            
        });
        console.log(that.data.tickets)
      },
      complete: function() {
        wx.hideLoading()
      },
      fail:function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '获取票务信息失败，请稍后再试！',
          image: '../../image/info.png',
          duration: 3000
        })
        console.log(res)
      }
    });
  },
  //加载更多
  onReachBottom: function() {
      return
  },
  //刷新处理
  onPullDownRefresh: function(e) {
      var that = this
      //数据重置
      that.data.tickets = []
      that.loadTicket()
  },

  onShow: function() {
      var that = this
      that.data.myTickets = wx.getStorageSync(app.globalData.storage_MyTicket)   
      that.calShow()
  },

  //初始化
  onLoad: function () {
    var that = this    
    var oldPackCode = wx.getStorageSync(app.globalData.storage_ParkCode)
    if (oldPackCode != app.globalData.parkcode){
      wx.setStorageSync(app.globalData.storage_ParkCode, app.globalData.parkcode)
      wx.setStorageSync(app.globalData.storage_MyTicket, [])
    }

    that.data.buyDate = that.getNowDate()
    //动画显示
    that.setData({
      hiddenFoorter: that.data.hiddenMyTick,
      nowDate:that.data.buyDate,
      startDate:that.data.buyDate
    })
    
    //拉取商品信息  
    that.loadTicket()
  }
})
