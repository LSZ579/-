// pages/shareDetail/index.js
let app=require('../../utils/init'),apps=getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    detail:{},
    img:[],
    width:0,
    flag:true,
    list:[],
    query:{
      page:1,
      limit:8,
      share_id:''
    },
    content:'',
    hasMore:true
  },
  onLoad: function (o) {
    let os=JSON.parse(o.item);
    this.setData({
      detail:os,
      img:os.img,
      width:(app.sysInfo.windowWidth)/3-6,
    })
    this.data.query.share_id=os.id;
    this.getCommentList()
    console.log(this.data.list)
  },
  previews(e){
    let index=e.currentTarget.dataset.index,urls=e.currentTarget.dataset.pre;
    wx.previewImage({
      current: index, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  toComment(){
    this.setData({
      flag:!this.data.flag
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.pop=this.selectComponent('#pop')
  },
  showModel(){
    this.setData({
      content:''
    })
    this.pop.toggleModel()
  },
  getValue(e){
    console.log(e)
    this.setData({
      content:e.detail.value
    })
  },
  addComment(){
    let content=this.data.content;
    if(!content){
      app.toast('内容不能为空')
      return
    }
    wx.showLoading({
      title: '发送中',
      mask:true
    })
    app.request('/app/comments',{content:content,share_id:this.data.detail.id}).then(res=>{
      if(res.code==4001){
        app.toast(res.mes)
        return
      }
      if(res){
        app.toast('评论成功','success')
        this.showModel()
        this.data.list=[]
        this.data.query.page=1;
        this.getCommentList()
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  hide(){
    this.setData({
      flag:!this.data.flag
    })
  },
  getCommentList(){
    let data=this.data.query,oldList=this.data.list,news=[];
    app.request('/app/getComment',this.data.query).then(res=>{
      console.log(res.data)
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
        this.setData({
          list: oldList.concat(news)
        })
        console.log(res.data)
      }).catch(err=>{})
  },
  toLogin(){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      show: false
    })
      wx.navigateBack({
        delta: 1,
      })
  },
  commit(){
    let data={
      share_id:this.data.detail.id,
      content:'测试'
    };
    app.request('/app/comments',data).then(res=>{})
  },
  // shareHaddle(e){
  //   let share_id=e.currentTarget.dataset.id;
  //   var that = this;
  //     app.request('/app/shareCount',{share_id}).then(res=>{
  //       console.log(res)
  //       wx.showToast({
  //         title: '分享成功',
  //         icon: "none"
  //       });
  //     }).catch(res=>{
  //       this.toLogin()
  //     })
  // },
  likeHaddle(e){
    if(!this.data.flag){return}
    this.data.flag=false
    let share_id=e.currentTarget.dataset.shareid,nums=Number(this.data.detail.like_count);
    this.setData({
      current:true
    })
    app.request('/app/like',{share_id}).then(res=>{
        this.setData({
          flag:true,
          ['detail.likes.like']:res,
          ['detail.like_count']:res?nums+1:nums-1
        })
    }).catch(()=>{
      this.toLogin()
    })
   setTimeout(res=>{
    this.setData({
      current:null,
      flag:true
    })
   },1000)
  },
  onReachBottom: function () {
    if(this.data.hasMore){
      this.getCommentList()
    }else{
      app.toast('呜呜，已经到底啦！')
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },

  onShareTimeline(){
    return{
      title:'分享了一个精美头像',
    query:'pages/shareDetail/index?item='+this.data.detail,
    imageUrl:this.data.img[0]
    }
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let share_id=e.target.dataset.id,index=e.target.dataset.index,item=e.target.dataset.item;
    var that = this,nums=this.data.detail.share==null?0:Number(this.data.detail.share.count);
    app.request('/app/shareCount',{share_id}).then(res=>{
      console.log(res)
      wx.showToast({
        title: '分享成功',
        icon: "none"
      });
      this.setData({
        ['detail.share.count']:nums+1
      })
    }).catch(res=>{
      this.toLogin()
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