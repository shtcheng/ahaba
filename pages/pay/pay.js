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

  pay : function(){
    if (app.globalData.phone.length == 0){
      wx.navigateTo({
        url: '../register/register',
        success: function(res){}
      })
      return
    }

    //获取账户数据
    var token = sha1.hex_sha1("account"+app.globalData.pAppKey+app.globalData.phone)
    var strUrl = app.globalData.rootUrl +  "/account?token=" +token+ "&mobile=" + app.globalData.phone
    wx.request({
      url: strUrl,
      data: {},
      method: 'GET',
      success: function(res){
        if (res.result != 1) {
          console.log(res.message)
          return
        }
        
        var account = JSON.parse(res.data)
        if(account.hastmoney < totalPrice){
          //转到充值
          wx.navigateTo({
            url: '../charge/charge',
            success: function(res){}
          })
        }else{
          //支付
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
        if (res.result <= 0) {
          console.log(res.message)
          return
        }
        var pack = JSON.parse(res.data)
        if (ticket.length == 0){
          return
        }
        that.setData({
          packName:pack[0].name,          
        })
      }
    });
  }
})
