//获取应用实例
var app = getApp()
//倒计时
function countdown(that) {
  var second = that.data.second 
  if (second == 0) {
    that.setData({
      codeButtText: "获取验证码" ,
      disabledGetCode:false
    });
    return;
  }
  var time = setTimeout(function(){
    that.setData({
      second: second - 1 ,
      codeButtText : second + "秒"
    });
    countdown(that);
  },1000)
}

Page({
  data: {
    timeOut:60,
    second:0,

    checkBox: true,

    phone: "",
    checkcode:0
  },
  
  //获取电话号码
  getPhone : function(e){
    var that = this  
    var phone = /^0?1[3|4|5|8][0-9]\d{8}$/; 
    if(!phone.test(e.detail.value)) { 
        that.setData({
          disabledGetCode:true,
        })
        return;
    } 

    //号码格式正确，获取验证码按钮可用
    that.setData({disabledGetCode:false})    
    that.data.phone = e.detail.value
  },

  //获取验证码
  getCode: function() {
    var that = this  
    that.setData({disabledGetCode:true})    
    //倒计时
    that.data.second = that.data.timeOut
    countdown(that)

    //获取验证码
    wx.request({
        url: app.globalData.rootUrl + "/getCVC?phone="+that.data.phone,
        data: {},
        method: 'GET',
        success: function(res){
          if (res.status != 0) {
            console.log(res)
            that.setData({disabledGetCode:false})            
            return
          } 
        } 
     });     
  },

  //验证码
  inputCode: function(e) {
    if (isNaN(e.detail.value)){
       return
    }
    
    var that = this  
    that.data.checkcode = parseInt(e.detail.value)
  },

  //提交
  submit: function(){
    var that = this  
    if (that.data.checkcode == 0 || that.data.phone.length == 0){
      return
    }
    var phone = /^0?1[3|4|5|8][0-9]\d{8}$/; 
    if(!phone.test(that.data.phone)) { 
        return;
    } 

    //绑定手机
    wx.request({
        url: app.globalData.rootUrl + "/bindPhone?phone="+that.data.phone+"&cvc="+that.data.checkcode + 
          "&openid="+app.globalData.openid,
        data: {},
        method: 'GET',
        success: function(res){
          if (res.status != 0) {
            console.log(res)
            return
          }

          app.globalData.register = true
          app.globalData.phone = that.data.phone
          //返回首页
          wx.navigateTo({
            url: 'pages/index/index',
            success: function(res){}
          })
        }
     });
  },

  //用户协议跳转
  goToProto : function(){
    wx.navigateTo({
      url: 'pages/proto/proto',
      success: function(res){}
    })
  },

  //用户协议选择
  listenCheckboxChange : function(e){
     var that = this  
     that.data.checkBox = !that.data.checkBox
     that.setData({
      disabledSubmit : that.data.checkBox,
     })  
  },

  onLoad: function () {
    var that = this  
    that.setData({
      disabledGetCode:true,
      disabledSubmit : that.data.checkBox,
      codeButtText:"获取验证码"
    })  
  }
})
