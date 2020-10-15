// pages/share/share.js
let app=require('../../utils/init'),apps=getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:0,
    show:util.get('token')?true:false,
    list:[],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:null,
    current:null,
    query:{
      page:1,
      limit:15
    },
    hasMore:true,
    isAdmin:false,
    flag:true,
    updates:false,//是否刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      width:(app.sysInfo.windowWidth)/3-6,
      show:util.get('token')?true:false
    })
    this.shareMessage()
  },
  // 预览图片
  previews(e){
    let index=e.currentTarget.dataset.index,urls=e.currentTarget.dataset.pre;
    console.log(index)
    wx.previewImage({
      current: index, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 查看详情
  toComment(e){
    let item=e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../share_detail/index?item='+JSON.stringify(item),
    })
  },
  // 点赞
  likeHaddle(e){
    if(!this.data.flag){return}
    this.data.flag=false
    let share_id=e.currentTarget.dataset.shareid;
    let index=e.currentTarget.dataset.index,nums=Number(this.data.list[index].like_count);
    this.setData({
      current:index
    })
    app.request('/app/like',{share_id}).then(res=>{
        this.setData({
          flag:true,
          ['list['+index+'].likes.like']:res,
          ['list['+index+'].like_count']:res?nums+1:nums-1
        })
    }).catch(()=>{
      this.setData({
        show:false
      }) 
    })
   setTimeout(res=>{
    this.setData({
      current:null,
      flag:true
    })
   },1000)
  },
  // 获取图文列表信息,及用户信息
  shareMessage(){
    wx.showLoading({
      title: '加载中',
    })
    let data=this.data.query,oldList=this.data.list,news=[];
    app.request('/app/getShare',data).then(res=>{
      news=res.data
        if(res.data.length==0){
          this.data.hasMore=false
        }
        else if(res.data.length<data.limit){
          this.data.hasMore=false
        }
        else if(res.data.length==data.limit){
          this.data.query.page=data.page+1
          this.setData({
            hasMore:true
          })
        }
        for(var i=0,len=news.length;i<len;i++){
          if(news[i].img!=null){
            news[i].img=JSON.parse(news[i].img)
          for(var j=0,le=news[i].img.length;j<le;j++){
            news[i].img[j]=app.fileUrl+news[i].img[j]
          }
          }
        }
        this.setData({
          list: oldList.concat(res.data)
        })
        wx.hideLoading()
      
    }).catch(res=>{
      console.log('时效') 
      this.setData({
        show:false
      }) 
      wx.hideLoading()
    })
  },
  
  toEdit(){
    wx.navigateTo({
      url: '../editInfo/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(util.get('token'))
    wx.showLoading({
      title: '加载中'
    })
    if(this.data.updates){
      this.data.list=[]
      this.data.query.page=1
      this.shareMessage()
    }
    console.log(apps.globalData)
    let token=util.get('token')
    if (token) {
      this.setData({
        userInfo: apps.globalData.userInfo,
        hasUserInfo: true
      })
      wx.hideLoading()
    } else if (this.data.canIUse){
      apps.userInfoReadyCallback = res => {
        wx.hideLoading()
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          // apps.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      wx.hideLoading()
    }
    setTimeout(res=>{
      wx.hideLoading()
    },400)
  },
  //获取token
  getUserInfo: function(e) {
    let info=e.detail.userInfo
    if(info){
      wx.login({
        success:o=>{
          app.request('/token/user',{code:o.code,name:info.nickName,avatar:info.avatarUrl}).then(res=>{
            console.log(res)
            apps.globalData.token=res.token
            if(res.uid==1){
              this.setData({
                isAdmin:true
              })
            }
            util.set('token',res.token,7200)
            apps.globalData.isLogin=true
            this.shareMessage()
            console.log(apps.globalData)
          })
        }
      })
      apps.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        show: true
      })
    }
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.query.page=1
    this.data.list=[]
    this.shareMessage(() => {
      wx.stopPullDownRefresh()
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.hasMore){
      this.shareMessage()
    }else{
      app.toast('呜呜，已经到底啦！')
    }
  },
  onShareTimeline(){
    return{
      title:'分享了一个小程序'
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let share_id=e.target.dataset.id,index=e.target.dataset.index,item=e.target.dataset.item;
    var that = this,nums=this.data.list[index].share==null?0:Number(this.data.list[index].share.count);
      app.request('/app/shareCount',{share_id}).then(res=>{
        console.log(res)
        this.setData({
          ['list['+index+'].share.count']:nums+1
        })
        wx.showToast({
          title: '分享成功',
          icon: "none"
        });
      }).catch(()=>{
        this.setData({
          show:false
        }) 
      })
    return {
      title: apps.globalData.userInfo.nickName+"分享给你一张图片",
      path: '/pages/shareDetail/index?item='+JSON.stringify(item),
      imageUrl: '',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
        })
      }
    }
  }
})