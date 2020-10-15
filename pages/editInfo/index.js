// pages/editInfo/index.js
let app=require('../../utils/init')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:0,
    file:[],
    fileList:[],
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onReady(){
    this.setData({
      width:(app.sysInfo.windowWidth)/4-16
    })
  },
  getValue(e){
    this.setData({
      content:e.detail.value
    })
  },
  insertImg(e) {
    let that = this;
    var arr = [],newArr=[],fileList=[];
    if(9-that.data.fileList.length==0){
      return
    }
    wx.chooseImage({
      count: 9-that.data.fileList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        wx.showLoading({
          title: '正在上传中',
        })
      const tempFilePaths = res.tempFilePaths
      for (let i = 0; i < tempFilePaths.length;i++){
        let uploadTask=wx.uploadFile({
          url: app.baseUrl+'/app/uploadImg', 
          header: {
            "Content-Type": "multipart/form-data", 
            // 'Authorization': 'Bearer ' + app.globalData.token,
          },
          filePath: tempFilePaths[i],
          name: 'file',
          formData: null,
          success (res){
            var datas = JSON.parse(res.data);
            if(datas.code==200){
              newArr=that.data.fileList.concat([datas.url])
              arr = that.data.file.concat([app.fileUrl+datas.url])
              that.setData({
                fileList: newArr,
                file:arr
              })
            }
            else if(datas.code==4001){
              app.toast(datas.mes)
            }
            else{
              app.toast('上传失败');
            }
            wx.hideLoading()
          }
        })
        uploadTask.onProgressUpdate((res) => {
          wx.showLoading({
            title: '正在上传',
          })
          if(res.progress==100){
            console.log('上传进度', res.progress)
           // wx.hideLoading()
          }
        })
      }
      }
    })
  },
  //预览图片
  previewImg(e) {
    let url = e.currentTarget.dataset.imgurl;
    let that = this;
    console.log(url)
    wx.previewImage({
      current:url,
      urls: that.data.file,
      success: (res) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },

  //删除图片
  delImg(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let that = this;
    this.data.fileList.splice(index, 1)
    this.data.file.splice(index, 1)
    this.setData({
      fileList: that.data.fileList,
      file: that.data.file
    })
  },
  summit(){
    if(this.data.content==''){
      app.toast('内容不能为空')
      return
    }
    wx.showLoading({
      title: '发送中...',
      mask:true
    })
    app.request('/app/ShareImg',{img:JSON.stringify(this.data.fileList),content:this.data.content}).then(res=>{
      if(res.code==4001){
        app.toast(res.mes)
        return
      }
      wx.showLoading({
        title: '分享成功，即将返回',
        mask:true
      })
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        updates: true
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },400)
    })
  }
})