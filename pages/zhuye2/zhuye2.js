//logs.js
var app = getApp()

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.loadChannelInfo();
  },

  //跳转到用户中心
  goToUserCenter: function () {
    wx.navigateTo({
      url: '../user/user',
      success: function (res) { }
    })
  },


  //充值按钮事件处理
  chargeTap: function () {
    wx.navigateTo({
      url: '../charge/charge'
    })
  },

  //扫描二维码，获取游乐园信息编码及通道编码
  scanqrcode: function () {

    wx.scanCode({
      success: (res) => {
        console.log("scanCode: " + res.result);
        var val = res.result;
        var mark = app.globalData.rootUrl + "/qrcode?";
        var prex = res.result.substring(0, mark.length);

        if (prex == mark) {
          var val2 = val.substring((mark.length), val.length)
          this.parseData(val2)
          wx.navigateTo({
            url: '../index/index'
          })
        } else {
          wx.showToast({
            title: '不符合规则的二维码，请选择正确的二维码进行扫描！',
            image: '../../image/info.png',
            duration: 3000
          })
        }
        return;
      },

      fail: (res) => {

      },

      complete: (res) => {

      }
    })
  },

  parseData: function (val) {
    var vals = new Array();
    vals = val.split("&");
    for (var i = 0; i < vals.length; i++) {
      var data = new Array();
      data = vals[i].split("=")
      var pr = data[0].toLowerCase();
      if (pr == "parkcode") {
        app.globalData.parkcode = data[1];
      } else if (pr == "itemcode") {
        app.globalData.itemcode = data[1];
      }
    }
    console.log("parkcode: " + app.globalData.parkcode);
    console.log("itemcode: " + app.globalData.itemcode);
  },


  //测试，获取通道最新售出票的信息
  loadChannelInfo: function () {
    var that = this;
    var strUrl2 = app.globalData.rootUrl + '/getdata?query=ticket&parkcode=' + app.globalData.parkcode + '&itemcode=' + app.globalData.itemcode;
    console.log("测试，获取通道最新售出票的信息");
    console.log(strUrl2);
    wx.request({
      url: strUrl2,
      data: {},
      method: 'GET',
      success: function (res) {
        if (res.data.result <= 0) {
          wx.showToast({
            title: '获取通道最新售出票的信息失败，请稍后再试！',
            image: '../../image/info.png',
            duration: 3000
          })
          return;
        }
        console.log(res);
      },

      fail: function (res) {
        if (res.data.result <= 0) {
          wx.showToast({
            title: '获取通道最新售出票的信息失败，请稍后再试！',
            image: '../../image/info.png',
            duration: 3000
          })
          return;
        }
      }
    });
  },
})
