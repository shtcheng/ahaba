//pay.js
//获取应用实例
var app = getApp()
Page({
  data: {
    buyDate:"",
    myTickets:[],
  },
  
  onLoad: function (options) {
    var that = this
    that.data.buyDate = options.date
    that.data.myTickets = wx.getStorageSync('myTicket')
    that.setData({
      myTicketList:that.data.myTickets,
    })
  }
})
