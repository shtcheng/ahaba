//index.js
//获取应用实例
var app = getApp();
//倒计时
function countdown(that) {
  var second = that.data.second 
  if (second == 0) {
    that.setData({
      codeButtText: "获取验证码" 
    });
    return;
  }
  var time = setTimeout(function(){
      that.setData({
        second: second - 1 ,
        codeButtText : second + "秒后获取"
      });
      countdown(that);
      },1000)
}

Page({
   data: {
    timeOut:60,
    second:0,

    phone: ""
  },
  //获取电话号码
  getPhone : function(e){
    var phone = /^0?1[3|4|5|8][0-9]\d{8}$/; 
    if(!phone.test(e.detail.value)) 
    { 
        this.setData({disabledGetCode:true})
        return;
    } 

    this.setData({disabledGetCode:false})
    this.data.phone = e.detail.value
    console.log(this.data.phone)
  },
   //获取验证码
  getCode: function() {    
    this.setData({disabledGetCode:true})
    //获取验证码

    //倒计时
    this.data.second = this.data.timeOut
    countdown(this)
  },
  //验证
  checkCode: function(e) {
    if (e.detail.value.length == 4){
      if (isNaN(e.detail.value)){
        return
      }

      //验证
      var checkCode = parseInt(e.detail.value)
      this.setData({showBind:false})
      this.setData({showProto:true})
      this.setData({showIndex:false})
    }
  },

  //接受协议
  confirmProto : function(){
    this.setData({showBind:false})
    this.setData({showProto:false})
    this.setData({showIndex:true})  
  },

  onLoad: function () {
    this.setData({disabledGetCode:true})
    this.setData({codeButtText:"获取验证码"}) 
    //从服务器拉去数据
    
    this.setData({showBind:true})
    this.setData({showProto:false})
    this.setData({showIndex:false})    
  }
})
