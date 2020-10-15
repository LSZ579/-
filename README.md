# -
最近无聊写了个小程序，带发布图片内容功能，提交审核后被驳回，才了解到个人小程序不开放信息发布功能。= =
技术简单明了，分享给大家
效果图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015210849305.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTMwODQzNg==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015210849226.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTMwODQzNg==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020101521084997.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTMwODQzNg==,size_16,color_FFFFFF,t_70#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015213531589.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTMwODQzNg==,size_16,color_FFFFFF,t_70#pic_center)
列表数据结构
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201015210848872.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTMwODQzNg==,size_16,color_FFFFFF,t_70#pic_center)
附带了一个弹出层组件
wxml：

```javascript
<!--components/popup/popup.wxml-->
<view bindtap="toggleModel" class="pop-mask {{showModel?'actives':''}}">
</view>
<view class="pop-content {{showModel?'show':'hide'}}"><slot></slot></view>

```
js

```bash
// components/popup/popup.js
Page({
  data: {
    showModel:false
  },
  toggleModel(){
    console.log(666999,this.data.showModel)
    this.setData({
      showModel:!this.data.showModel
    })
  }
  })

```

css

```bash
/* components/popup/popup.wxss */
.pop-mask{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0,0.5);
  display: none;
  z-index: 10;
 
}
.hide{
  animation: popup 0.4s ease;
  position: absolute;
  bottom: 0;
  width: 100%;
  transform: translateY(0);
}
@keyframes popup{
  0%{
    transform: translateY(0);
    
  }
  30%{
    opacity: 0;
  }
  100%{
    opacity: 0;
    transform: translateY(30vh);
  }
}
.actives{
  display: block;
  
}
.pop-content{
  position: fixed;
  bottom: 0;
  width: 750rpx;
  background-color: rgb(255, 255, 255);
  transform: translateY(150%);
  transition: all 0.4 ease;
  z-index: 12;
}
.acvtive{
  transform: translateY(0);
}

.show{
  animation: pop 0.4s ease;
  height:auto;
  position: absolute;
  bottom: 0;
  width: 100%;
  transform: translateY(0);

  z-index: 99;
}
  @keyframes pop{
    from{
      transform: translateY(100%);
      
    }
    to{
      transform: translateY(0);
    }
  }
```

github地址：https://github.com/LSZ579/-/tree/master

