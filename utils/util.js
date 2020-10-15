const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var dtime = '_deadtime';
function set(k, v, t) {
  wx.setStorageSync(k, v)
  var seconds = parseInt(t);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(k + dtime, timestamp + "")
  } else {
    wx.removeStorageSync(k + dtime)
  }
}
 
function get(k, def) {
  var deadtime = parseInt(wx.getStorageSync(k + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { return def; } else { return; }
    }
  }
  var res = wx.getStorageSync(k);
  if (res) {
    return res;
  } else {
    return def;
  }
}
 
function remove(k) {
  wx.removeStorageSync(k);
  wx.removeStorageSync(k + dtime);
}
 
function clear() {
  wx.clearStorageSync();
}

module.exports = {
  formatTime: formatTime,
  set: set,
  get: get,
  remove: remove,
  clear: clear,
}
