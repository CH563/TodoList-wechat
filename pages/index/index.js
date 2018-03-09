//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    addShow: false,
    addText: '',
    status: '1',
    focus: false,
    lists: [],
    curLists: [],
    editIndex: 0,
    delBtnWidth: 120, // 删除按钮宽度单位（rpx）
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  changeTodo: function (e) {
    var _this = this
    var item = e.currentTarget.dataset.item
    var temp = _this.data.lists
    temp.forEach(el => {
      if (el.id === item) {
        if (el.status === '0') {
          el.status = '1'
          _this.showCur(temp)
          wx.setStorage({
            key:"lists",
            data: temp
          })
          wx.showToast({
            title: '已完成任务',
            icon: 'success',
            duration: 1000
        });
        } else {
          wx.showModal({
            title: '',
            content: '该任务已完成，确定重新开始任务？',
            confirmText: "确定",
            cancelText: "不了",
            success: function (res) {
                if (res.confirm) {
                  el.status = '0'
                  _this.showCur(temp)
                  wx.setStorage({
                    key:"lists",
                    data: temp
                  })
                }else{
                  return console.log('不操作')
                }
            }
          })
        }
      }
    })
    console.log(item)
  },
  addTodoShow: function () {
    this.setData({
      addShow: true,
      focus: true
    })
  },
  addTodoHide: function () {
    this.setData({
      addShow: false,
      focus: false,
      addText: ''
    })
  },
  setInput: function (e) {
    this.setData({
      addText: e.detail.value
    })
  },
  addTodo: function () {
    if (!this.data.addText.trim()) {
      return
    }
    var temp = this.data.lists
    var addT = {
      id: new Date().getTime(),
      title: this.data.addText,
      status: '0'
    }
    temp.push(addT)
    this.showCur(temp)
    this.addTodoHide()
    wx.setStorage({
      key:"lists",
      data: temp
    })
    wx.showToast({
      title: '添加成功!',
      icon: 'success',
      duration: 1000
    });
  },
  showCur: function (data) {
    if (this.data.status === '1') {
      this.setData({
        lists: data,
        curLists: data
      })
    } else {
      this.setData({
        lists: data,
        curLists: data.filter(item => +item.status === (this.data.status - 2))
      })
    }
  },
  showStatus: function (e) {
    var st = e.currentTarget.dataset.status
    if (this.data.status === st) return
    if (st === '1') {
      this.setData({
        status: st,
        curLists: this.data.lists
      })
      return
    }
    this.setData({
      status: st,
      curLists: this.data.lists.filter(item => +item.status === (st - 2))
    })
  },
  touchS: function (e) {
    // console.log('开始：' + JSON.stringify(e))
    // 是否只有一个触摸点
    if(e.touches.length === 1){
      this.setData({
        // 触摸起始的X坐标
        startX: e.touches[0].clientX
      })
    }
  },
  touchM: function (e) {
    // console.log('移动：' + JSON.stringify(e))
    var _this = this
    if(e.touches.length === 1){
     // 触摸点的X坐标
      var moveX = e.touches[0].clientX
      // 计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = _this.data.startX - moveX
     // delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = _this.data.delBtnWidth
      var txtStyle = ''
      if (disX == 0 || disX < 0){ // 如果移动距离小于等于0，文本层位置不变
        txtStyle = 'left:0'
      } else if (disX > 0 ){ // 移动距离大于0，文本层left值等于手指移动距离
        txtStyle = 'left:-' + disX + 'rpx'
        if(disX >= delBtnWidth){
          // 控制手指移动距离最大值为删除按钮的宽度
          txtStyle = 'left:-' + delBtnWidth + 'rpx'
        }
      }
      // 获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = _this.data.curLists
      // 将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle
      // 更新列表的状态
      this.setData({
        curLists: list
      });
    }
  },
  touchE: function (e) {
    // console.log('停止：' + JSON.stringify(e))
    var _this = this
    if(e.changedTouches.length === 1){
      // 手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX
      // 触摸开始与结束，手指移动的距离
      var disX = _this.data.startX - endX
      var delBtnWidth = _this.data.delBtnWidth
      // 如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth/2 ? 'left:-' + delBtnWidth + 'rpx' : 'left:0'
      // 获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index
      var list = _this.data.curLists
      list[index].txtStyle = txtStyle
      // 更新列表的状态
      _this.setData({
        curLists: list
      });
    }
  },
  delTodo: function (e) {
    var _this = this
    var item = e.currentTarget.dataset.item
    var temp = _this.data.lists
    temp.forEach( (el, index) => {
      if (el.id === item) {
        temp[index].txtStyle = 'left:0'
        wx.showModal({
          title: '',
          content: '您确定要删除吗？',
          confirmText: "确定",
          cancelText: "考虑一下",
          success: function (res) {
            if (res.confirm) {
                temp.splice(index, 1)
                _this.showCur(temp)
                wx.setStorage({
                  key:"lists",
                  data: temp
                })
            } else {
                _this.showCur(temp)
                return console.log('不操作')
              }
          }
        })
      }
    })
    
  },
  // onPullDownRefresh:function()
  // {
  //   wx.showNavigationBarLoading() //在标题栏中显示加载
    
  //   //模拟加载
  //   setTimeout(function()
  //   {
  //     // complete
  //     wx.hideNavigationBarLoading() //完成停止加载
  //     wx.stopPullDownRefresh() //停止下拉刷新
  //   },1500);
  // },
  onLoad: function () {
    var _this = this
    wx.getStorage({
      key: 'lists',
      success: function(res) {
        console.log(res.data)
        _this.setData({
          lists: res.data,
          curLists: res.data
        })
      } 
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
