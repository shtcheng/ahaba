//index.js
//获取应用实例
var app = getApp();
//倒计时
function countdown(that) {
  var second = that.data.second 
  if (second == 0) {
    that.setData({
      codeButtText: "获取" ,
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

    phone: "",
    checkcode:0
  },

  //获取电话号码
  getPhone : function(e){
    var phone = /^0?1[3|4|5|8][0-9]\d{8}$/; 
    if(!phone.test(e.detail.value)) { 
        this.setData({disabledGetCode:true})
        this.setData({disabledInputCode:true})
        return;
    } 
    //号码格式正确，获取验证码按钮可用
    this.setData({disabledGetCode:false})    
    this.data.phone = e.detail.value
  },

   //获取验证码
  getCode: function() {    
    this.setData({disabledGetCode:true})
    //TODO获取验证码

    this.setData({disabledInputCode:false})    

    //倒计时
    this.data.second = this.data.timeOut
    countdown(this)
  },

  //验证码
  inputCode: function(e) {
    if (isNaN(e.detail.value)){
       return
    }
      
    this.data.checkcode = parseInt(e.detail.value)
  },

  //提交
  submit: function(){
    //TODO
    if (this.data.checkcode == 0 || this.data.phone.length == 0){
      return
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
    this.setData({disabledInputCode : true})
    this.setData({codeButtText:"获取"}) 
    //从服务器拉去数据
    
    this.setData({showBind:true})
    this.setData({showProto:false})
    this.setData({showIndex:false})    
  }
})
