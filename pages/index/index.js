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
    checkcode:0,

    page:0,
    pnum:10,
    hasMore:true,
    ticket:[]
  },

  //获取电话号码
  getPhone : function(e){
    var phone = /^0?1[3|4|5|8][0-9]\d{8}$/; 
    if(!phone.test(e.detail.value)) { 
        this.setData({
          disabledGetCode:true,
          disabledInputCode:true
        })
        return;
    } 
    //号码格式正确，获取验证码按钮可用
    this.setData({disabledGetCode:false})    
    this.data.phone = e.detail.value
  },

   //获取验证码
  getCode: function() {    
    this.setData({disabledGetCode:true})

    //获取验证码
    wx.request({
        url: app.globalData.rootUrl + "/getCVC?phone="+this.data.phone,
        data: {},
        method: 'GET',
        success: function(res){
          if (res.status != 0) {
            console.log(res)
            this.setData({disabledGetCode:false})
            alert(res.msg)
            return
          }
          
          this.setData({disabledInputCode:false})    

          //倒计时
          this.data.second = this.data.timeOut
          countdown(this)
        } 
     });     
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
    if (this.data.checkcode == 0 || this.data.phone.length == 0){
      return
    }

    //绑定手机
    wx.request({
        url: app.globalData.rootUrl + "/bindPhone?phone="+this.data.phone+"&cvc="+this.data.checkcode + 
          "&openid="+app.globalData.openid,
        data: {},
        method: 'GET',
        success: function(res){
          if (res.status != 0) {
            console.log(res)
            alert(res.msg)
            return
          }

          this.setData({
            showBind:false,
            showProto:true,
            showIndex:false
            })

          //加载用户协议
          wx.request({
              url: app.globalData.rootUrl + "/getAgreement",
              data: {},
              method: 'GET',
              success: function(res){
                if (res.status != 0) {
                  console.log(res)
                  alert(res.msg)
                  return
                }

                this.setData({userAgreement: res.msg})
              } 
          });
        } 
     });
  },

  loadTicket : function(){
    console.log("loadTicket")
  },
  //加载更多
  loadMore: function(e) {
      this.setData({
        hasRefesh:true
      });
      if (!this.data.hasMore) 
        return

      wx.request({
          url: app.globalData.rootUrl + '/getTicket?page='+(this.data.page++)+'&pnum='+this.data.pnum,
          data: {},
          method: 'GET',
          success: function(res){
            if (res.status != 0) {
              console.log(res)
              alert(res.msg)
              return
            }

            this.setData({
              ticket : this.ticket.concat(res.msg),
              hidden: true,
              hasRefesh: false
            });
          } 
      });
  },
  //刷新处理
  refesh: function(e) {
  var that = this;
  that.setData({
      hasRefesh:true,
  });
      var url = 'http://v.juhe.cn/weixin/query?key=f16af393a63364b729fd81ed9fdd4b7d&pno=1&ps=10';
      network_util._get(url,
      function(res){
      that.setData({
        list:res.data.result.list,
        hidden: true,
        page:1,
        hasRefesh:false,
      });
      },function(res){
      console.log(res);
  })
  },
  //接受协议
  confirmProto : function(){
    this.setData({
      showBind:false,
      showProto:false,
      showIndex:true
      })
    this.loadTicket()
  },

  //初始化
  onLoad: function () {
    this.setData({
      hidden : true,
      hasMore : false
    })
    wx.login({
      success: function(res){            
        if(res.code) {  
             wx.getUserInfo({
                success: function (res) {
                   app.globalData.userInfo = res.userInfo;
                   console.log(app.globalData.userInfo)
                } 
            });  

            var d = app.globalData;
            var strUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&  grant_type=authorization_code';    
            wx.request({
                url: strUrl,
                data: {},
                method: 'GET',
                success: function(res){
                    app.globalData.openid = res.data.openid;
                    console.log(app.globalData.openid)

                    //是否绑定手机
                    wx.request({
                      url: app.globalData.rootUrl + "/checkBind?openid="+app.globalData.openid,
                      data: {},
                      method: 'GET',
                      success: function(res){
                      if (res.status != 0) {
                          console.log(res)
                          alert(res.msg)
                          return
                        }

                        if (0 == res.msg){
                          this.setData({
                            disabledGetCode:true,
                            disabledInputCode : true,
                            codeButtText:"获取",
                            showBind:true,
                            showProto:false,
                            showIndex:false
                            })                          
                        }else{
                          this.setData({
                              showBind:false,
                              showProto:false,
                              showIndex:true                              
                            })

                          this.loadTicket()
                        }
                      } 
                  });
              } 
            });  
          }else {
              console.log('获取用户登录态失败！' + res.errMsg)  
          }          
      }
    });
  }
})
