//pay.js
//获取应用实例
var sha1 = require('../../utils/sha1.js')
var app = getApp()
Page({
  data: {
    buyDate:"",
    myTickets:[],
    totalNum:0,
    totalPrice:0,
  },

  tradeinfo_pay: function (orderId) {
    var that = this
    var token = sha1.hex_sha1(orderId + app.globalData.pAppKey + app.globalData.phone)
    var strUrl = app.globalData.rootUrl + "/tradeinfo?cmd=pay&token=" + token + "&mobile=" + app.globalData.phone
    wx.request({
      url: strUrl,
      data: {
        orderid: orderId,
        amount: that.data.totalPrice,
        dt_pay: Date.parse(new Date()),
        paycontent: "购游乐票" + that.data.totalNum+"张"
      },
      method: 'POST',
      success: function (res) {        
        res = res.data
        if (res.result <= 0) {
          console.log("pay error:" + res.message)
          return
        }

        wx.showToast({
          title: '购买成功',
          icon: 'success',
          duration: 1500,
          success: function (res){
            wx.navigateTo({
              url: '../index/index',
              success: function (res) { }
            })
          }
        })

      }
    });
  },

  tradeinfo_order : function(){
    var that = this    
    var ticketlist = []
    for (var i = 0; i < that.data.myTickets.length; i++) {
      var tick = {}
      tick.id = that.data.myTickets[i].tid
      tick.num = that.data.myTickets[i].number
      ticketlist.push(tick)
    }
    
    var token = sha1.hex_sha1("tradeinfo" + app.globalData.pAppKey + app.globalData.phone)
    var strUrl = app.globalData.rootUrl + "/tradeinfo?cmd=order&token=" + token + "&mobile=" + app.globalData.phone
    wx.request({
      url: strUrl,
      data: {
        name: '购票',
        num: that.data.totalNum,
        amount: that.data.totalPrice,
        ticketlist: JSON.stringify(ticketlist)
      },
      method: 'POST',
      success: function (res) {
        res = res.data
        if (res.result <= 0){
          console.log(res.message)
          return
        }

        console.log(res.data)
        var orderId = JSON.parse(res.data).orderid
        console.log("order id :" + orderId)
        that.tradeinfo_pay(orderId)
        wx.setStorageSync(app.globalData.storage_MyTicket, [])
      }
    });
  },

  pay : function(){
    var that = this
    var phone = /^0?1[3|4|5|8][0-9]\d{8}$/;
    if (!phone.test(app.globalData.phone)) {
      wx.redirectTo({
        url: '../register/register',
        success: function (res) { }
      })
    } 

    //获取账户数据
    var token = sha1.hex_sha1("account"+app.globalData.pAppKey+app.globalData.phone)
    var strUrl = app.globalData.rootUrl +  "/account?token=" +token+ "&mobile=" + app.globalData.phone
    wx.request({
      url: strUrl,
      data: {},
      method: 'GET',
      success: function(res){
        res = res.data
        if (res.result != 1) {
          console.log(res.message)
          return
        }
        
        var account = JSON.parse(res.data)
        if (account.hasmoney < that.data.totalPrice){
          //转到充值
          wx.navigateTo({
            url: '../charge/charge',
            success: function(res){}
          })
        }else{
          //支付
          that.tradeinfo_order()
        }
      }
    });
  },

  onLoad: function (options) {
    var that = this
    that.data.buyDate = options.date
    that.data.myTickets = wx.getStorageSync(app.globalData.storage_MyTicket)

    for(var i = 0; i < that.data.myTickets.length; i++){
      that.data.totalNum += that.data.myTickets[i].number
      that.data.totalPrice += that.data.myTickets[i].number * that.data.myTickets[i].price
    }

    that.setData({
      itemName:that.data.myTickets[0].itemname,
      myPhone:app.globalData.phone,
      myTicketList:that.data.myTickets,
      totalPrice:that.data.totalPrice,
    })

    //获取游乐场信息
    var strUrl = app.globalData.rootUrl +  "/getdata?query=park&parkcode=" + app.globalData.parkcode
    wx.request({
      url: strUrl,
      data: {},
      method: 'GET',
      success: function(res){
        res = res.data
        if (res.result <= 0) {
          console.log(res.message)
          return
        }
        var pack = JSON.parse(res.data)
        if (pack.length == 0){
          return
        }
        that.setData({
          packName:pack[0].name,          
        })
      }
    });
  }
})
