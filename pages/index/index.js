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
    hasMore:false,
    ticket:[]
  },

  //获取电话号码
  getPhone : function(e){
    var that = this  
    var phone = /^0?1[3|4|5|8][0-9]\d{8}$/; 
    if(!phone.test(e.detail.value)) { 
        that.setData({
          disabledGetCode:true,
          disabledInputCode:true
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

    //获取验证码
    wx.request({
        url: app.globalData.rootUrl + "/getCVC?phone="+that.data.phone,
        data: {},
        method: 'GET',
        success: function(res){
          if (res.status != 0) {
            console.log(res)
            that.setData({disabledGetCode:false})
            alert(res.msg)
            return
          }
          
          that.setData({disabledInputCode:false})    

          //倒计时
          that.data.second = that.data.timeOut
          countdown(that)
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

    //动画显示      
    that.setData({
      hidden:false
    }); 
    //绑定手机
    wx.request({
        url: app.globalData.rootUrl + "/bindPhone?phone="+that.data.phone+"&cvc="+that.data.checkcode + 
          "&openid="+app.globalData.openid,
        data: {},
        method: 'GET',
        fail: function() {
          that.hiddenAll()
        },
        success: function(res){
          if (res.status != 0) {
            console.log(res)
            alert(res.msg)
            return
          }

          that.setData({
            showBind:false,
            showProto:true,
            showIndex:false
            })

          //加载用户协议
          wx.request({
              url: app.globalData.rootUrl + "/getAgreement",
              data: {},
              method: 'GET',
              fail: function() {
                that.hiddenAll()
              },
              success: function(res){
                if (res.status != 0) {
                  console.log(res)
                  alert(res.msg)
                  return
                }

                that.setData({userAgreement: res.msg})
                that.hiddenAll()
              } 
          });
        } 
     });
  },

  hiddenAll: function(){
    var that = this
    that.setData({
        hidden: true
    })
  },

  //加载商品
  loadTicket : function(){
    var that = this
    wx.request({
          url: app.globalData.rootUrl + '/getTicket?page='+(that.data.page++)+'&pnum='+that.data.pnum,
          data: {},
          method: 'GET',
          success: function(res){
            if (res.status != 0) {
              console.log(res)
              alert(res.msg)
              return
            }
            if (res.msg.length == 0){
              that.data.hasMore = false
            }else{
              that.data.hasMore = true
              that.setData({
                ticket : that.ticket.concat(res.msg),
              });
            }
          },
          fail: function() {
            that.data.page--            
          },
          complete: function() {
            that.hiddenAll()
          }
      });
  },
  //加载更多
  loadMore: function(e) {
      var that = this
      if (!that.data.hasMore) 
        return
      //动画显示      
      that.setData({
        hidden:false
      });      

      that.loadTicket()
  },
  //刷新处理
  refesh: function(e) {
      var that = this
      //数据重置
      that.data.page = 0
      that.data.ticket = []
      //动画显示
      that.setData({
          hidden:false
      });
      
      that.loadTicket()
  },
  //接受协议
  confirmProto : function(){
    var that = this
    that.setData({
      showBind:false,
      showProto:false,
      showIndex:true
      })
    that.loadTicket()
  },

  //初始化
  onLoad: function () {
    var that = this
    //动画显示
    that.setData({
      hidden : false
    })
    wx.login({
      fail: function() {
        that.hiddenAll()           
      },
      success: function(res){            
        if(res.code) {  
             wx.getUserInfo({
                success: function (res) {
                   app.globalData.userInfo = res.userInfo;
                   console.log(app.globalData.userInfo)
                },
                fail: function() {
                  that.hiddenAll()
                }
            });  

            var d = app.globalData;
            var strUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&  grant_type=authorization_code';    
            wx.request({
                url: strUrl,
                data: {},
                method: 'GET',
                fail: function() {
                  that.hiddenAll()           
                },
                success: function(res){
                    app.globalData.openid = res.data.openid;
                    console.log(app.globalData.openid)

                    //是否绑定手机
                    wx.request({
                      url: app.globalData.rootUrl + "/checkBind?openid="+app.globalData.openid,
                      data: {},
                      method: 'GET',
                      fail: function() {
                        that.hiddenAll()           
                      },
                      success: function(res){
                        if (0 == res.msg){
                          that.setData({
                            disabledGetCode:true,
                            disabledInputCode : true,
                            codeButtText:"获取",
                            showBind:true,
                            showProto:false,
                            showIndex:false
                            })                          
                        }else{
                          that.setData({
                              showBind:false,
                              showProto:false,
                              showIndex:true                              
                          })
                          that.loadTicket()
                        }
                      } 
                  });
              } 
            });  
          }else {
              console.log('获取用户登录态失败！' + res.errMsg)             
              that.hiddenAll()           
          }          
      }
    });
  }
})
