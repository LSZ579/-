 const baseUrl='https://lsz520.xyz/public/index.php/api/v1'
//const baseUrl='http://localhost/public/index.php/api/v1'
var util = require('./util.js'),
apps=getApp();
const req={
  baseUrl:baseUrl,
  sysInfo:wx.getSystemInfoSync(),
  //fileUrl:'http://localhost',
   fileUrl:'https://lsz520.xyz',
  request:function(url,data={},scope=true,method="post"){
   let token=util.get('token')
   if(!token&&!scope){
     req.toast('登录失效')
     return
   }
   return new Promise((reslove,reject)=>{
      wx.request({
        url: baseUrl+url,
        data,
        method,
        header: {
          // 'content-type': 'application/JSON',
          'token': token
        },
        success:function(res){
          console.log(res)
          if(res.statusCode==200){
            reslove(res.data)
          }else if(res.data.error_code==1001){
            console.log('bklla55d55')
            reject(res)
            wx.showModal({
              title: '提示',
              content: '登录已失效，请重新登录',
              success (res) {
                if (res.confirm) {
                } else if (res.cancel) {
                 
                }
              }
            })
          }
          else{
            req.toast('网络错误')
          }
        },
        fail:function(err){

          console.log(err,123)
          req.toast('网络错误s')
        }
      })
    })
  },

  toast(title,icon='none'){
    wx.showToast({
      title,
      icon
    })
  }
}
module.exports=req



