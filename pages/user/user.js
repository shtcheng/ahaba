//user.js
//获取应用实例
var app = getApp()
Page({
  data: {
    //motto: '你好，小程序！',
//    userInfo: {},
    ticketsHistory:[],
    phoneNumber:13730842688
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //充值按钮事件处理
  chargeTap:function() {
    wx.navigateTo({
      url: '../charge/charge'
    })
  },


  onLoad: function () {
    console.log('onLoad')
    var that = this
      //更新数据
      that.setData({
//          userInfo:app.globalData.userInfo,
          phoneNumber:app.globalData.phone
      })

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
                      that.data.ticketsHistory.push(tmp) 
                    }
                    that.setColor(that.data.ticketsHistory)
                    that.setData({
                      buytickets:that.data.ticketsHistory,
                    });
                    console.log(that.data.ticketsHistory)

  }
})
