function t(t, e, n) {
    return e in t ? Object.defineProperty(t, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = n, t;
}

function e() {
    (o = wx.getStorageSync("userInfo")) ? (wx.userInfo = o, wx.loginPromise = Promise.resolve(""), 
    o = null) : (wx.userInfo = {}, wx.loginPromise = new Promise(function(t, e) {
        function n() {
            new Promise(function(t, e) {}).then(function(t) {
                if (t.code) return wx.request({
                    url: "login",
                    data: {
                        code: t.code,
                        appType: 1
                    }
                });
                throw t;
            }).then(function(i) {
                t(i), t = e = n = null;
            }).catch(function(t) {
                ++i >= s.login.count ? e(t) : n();
            });
        }
        var i = 0;
        n();
    }).then(function(t) {
        return wx.userInfo = s.login.fn(t), wx.setStorage({
            key: "userInfo",
            data: wx.userInfo
        }), "";
    })), e = null;
}

function n() {
    new Promise(function(t, e) {
        wx.getSetting({
            success: function(e) {
                e.authSetting["scope.userInfo"] && wx.getUserInfo({
                    withCredentials: !1,
                    success: t
                });
            }
        });
    }).then(function(t) {
        var e = t.userInfo;
        e.nickName === wx.userInfo.nickName && e.avatarUrl === wx.userInfo.avatarUrl || wx.sendUserInfo(e);
    });
}

function i(t) {
    Object.defineProperties(t, p);
}

var a = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
    }
    return t;
};

require("config"), require("fn"), require("dayLimit"), require("common"), require("toggle");

var r, o, s = wx.config, u = require("sign"), c = {
    writable: !0
}, f = null, g = wx.getSystemInfoSync, l = wx.setStorage, d = wx.getStorage, h = wx.setStorageSync, w = wx.getStorageSync, x = wx.navigateToMiniProgram, m = wx.request, v = wx.getImageInfo;

Object.defineProperties(wx, {
    getSystemInfoSync: c,
    setStorage: c,
    getStorage: c,
    setStorageSync: c,
    getStorageSync: c,
    navigateToMiniProgram: c,
    request: c,
    getImageInfo: c
}), c = null, wx.getSystemInfoSync = function() {
    for (var t = 0; t < 3; ) try {
        return g();
    } catch (e) {
        t++;
    }
    return {
        model: "iPhone 6",
        pixelRatio: 2,
        windowWidth: 375,
        windowHeight: 603,
        system: "iOS 10.0.1",
        language: "zh_CN",
        version: "6.6.3",
        screenWidth: 375,
        screenHeight: 667,
        SDKVersion: "2.0.9",
        brand: "iPhone",
        fontSizeSetting: 16,
        benchmarkLevel: 1,
        batteryLevel: 100,
        statusBarHeight: 20,
        platform: "ios"
    };
}, wx.setStorage = function(t) {
    function e() {
        t.fail || (t.fail = function(t) {
            ++n < 3 && e();
        }), l(t);
    }
    var n = 0;
    e();
}, wx.getStorage = function(t) {
    function e() {
        t.fail || (t.fail = function(t) {
            ++n < 3 && e();
        }), d(t);
    }
    var n = 0;
    e();
}, wx.setStorageSync = function(t, e) {
    for (var n = 0; n < 3; ) try {
        return h(t, e), !0;
    } catch (t) {
        n++;
    }
    return !1;
}, wx.getStorageSync = function(t) {
    for (var e = 0; e < 3; ) try {
        return w(t);
    } catch (t) {
        console.log(777, t), e++;
    }
    return "";
}, wx.navigateToMiniProgram = function(t) {
    t.appId && (x(t), s.statistic && wx.reportAnalytics("leave_miniprogram", {
        appid: t.appId
    }));
}, wx.getImageInfo = function(t) {
    return t ? (-1 === t.indexOf("//tmp") && (t = t.replace(/https?/, "https")), new Promise(function(e, n) {
        v({
            src: t,
            success: e,
            fail: n
        });
    })) : Promise.resolve(null);
}, wx.request = function(t, e) {
    var n = this;
    return new Promise(function(i, a) {
        var o = t.filePath ? "formData" : "data", c = t.data || {};
        if (/^https/.test(t.url) || (t.url = s.base + s.interfaces[t.url]), t.header = {
            deviceInfo: r
        }, t[o] = c, t[o].SignatureMD5 = u.params(t[o]).SignatureMD5, t.success = i, t.fail = a, 
        e) return t.filePath ? wx.uploadFile(t) : m(t);
        n.requestTask = t.filePath ? wx.uploadFile(t) : m(t);
    }).then(function(t) {
        if (n.requestTask = null, 200 === t.statusCode && "string" == typeof t.data && (t.data = JSON.parse(t.data)), 
        200 === t.statusCode && "0" === t.data.ResultCode) return t.data;
        throw {
            errMsg: 200 !== t.statusCode ? t.statusCode.toString() : t.data.ResultMessage,
            origin: "server"
        };
    });
}, wx._request = m, wx.abort = function() {
    this.requestTask && this.requestTask.abort();
}, wx.repeatRequest = function(t, e, n) {
    return new Promise(function(i, r) {
        function o() {
            wx.request(a({}, t), n).then(function(e) {
                t = o = null, i(e);
            }).catch(function(t) {
                ++s >= e ? r(t) : o();
            });
        }
        var s = 0;
        o();
    });
}, wx.isGetFormId = !wx.DayLimit("formID", 0, !1).isExceed, wx.Common.prototype.checkFormId = function() {
    wx.isGetFormId !== this.data.isGetFormId && this.setData({
        isGetFormId: wx.isGetFormId
    }), this.onSetting && this.onSetting(wx.setting);
}, f = wx.getSystemInfoSync(), r = u.header({
    CH: s.CH,
    PID: s.PID,
    Ver: s.Ver,
    Height: f.windowHeight,
    Lang: f.language,
    Model: f.model,
    Net: "unknown",
    PixelRatio: f.pixelRatio,
    Version: f.version,
    Width: f.windowWidth
}), "devtools" === f.brand && (f.brand = f.model.split(" ")[0], f.platform = f.system.split(" ")[0].toLowerCase()), 
console.log(Object.assign({}, f), 111), wx.statusBarHeight = f.statusBarHeight, 
"CHM-TL00H".indexOf(f.model) > -1 && (wx.statusBarHeight = 0), wx.supperClass = f.model.replace(/\s+|<.+>|\(.+\)/g, "") + " " + f.brand + " " + f.platform, 
wx.platform = f.platform, wx.windowWidth = f.windowWidth, f = null, wx.sendUserInfo = function(t) {
    return t.userID = wx.userInfo.userID, wx.request({
        url: "sendUserInfo",
        data: a({}, t)
    }).then(function(e) {
        return wx.setStorage({
            key: "userInfo",
            data: t
        }), wx.userInfo = t, t;
    });
};

var p = {
    dynamicRelative: {
        get: function() {
            return this.data.baseData || this.data.baseDatas ? this.data.baseData || this.data.baseDatas[this.index] : {};
        }
    },
    dynamicKey: {
        get: function() {
            return this.data.baseData ? "baseData." : "baseDatas[" + this.index + "].";
        }
    },
    staticRelative: {
        get: function() {
            return this.baseData || this.baseDatas ? this.baseData || this.baseDatas[this.index] : {};
        }
    },
    pageIndex: {
        set: function(t) {
            this.staticRelative.pageIndex = t;
        },
        get: function() {
            return this.staticRelative.pageIndex;
        }
    },
    pageSize: {
        set: function(t) {
            this.needPageSize = t;
        },
        get: function() {
            return this.needPageSize || 30;
        }
    },
    hasNext: {
        set: function(t) {
            this.staticRelative.hasNext = t;
        },
        get: function() {
            return this.staticRelative.hasNext;
        }
    },
    filterStr: {
        set: function(t) {
            this.staticRelative.filterStr = t;
        },
        get: function() {
            return this.staticRelative.filterStr;
        }
    },
    isHideBackTop: {
        set: function(t) {
            this.staticRelative.isHideBackTop = t;
        },
        get: function() {
            return this.staticRelative.isHideBackTop;
        }
    },
    dataList: {
        set: function(t) {
            this.dynamicRelative.dataList = t;
        },
        get: function() {
            return this.dynamicRelative.dataList;
        }
    },
    every: {
        set: function(t) {
            this.dynamicRelative.every = t;
        },
        get: function() {
            return this.dynamicRelative.every;
        }
    },
    subNavIndex: {
        set: function(t) {
            this.staticRelative.subNavIndex = t;
        },
        get: function() {
            return this.staticRelative.subNavIndex;
        }
    },
    sectionIndex: {
        set: function(t) {
            this.staticRelative.sectionIndex = t;
        },
        get: function() {
            return this.staticRelative.sectionIndex;
        }
    },
    sectionPoistion: {
        set: function(t) {
            this.staticRelative.sectionPoistion = t;
        },
        get: function() {
            return this.staticRelative.sectionPoistion;
        }
    },
    LoadingText: {
        get: function() {
            return this.dynamicRelative.LoadingText;
        }
    },
    Error: {
        get: function() {
            return this.dynamicRelative.Error;
        }
    }
};

s.login.open && e(), wx.settingPromise = wx.request({
    url: "setting",
    data: {}
}).then(function(t) {
    return wx.setting = "";
});

var I = App, S = Page;

App = function(t) {
    wx.decorator(t, "onLaunch", function(t) {
        var e = this;
        this.onLogin && s.login.open && (wx.userInfo.userID ? (n(), n = null, this.onLogin(t)) : wx.loginPromise.then(function(i) {
            n(), n = null, e.onLogin(t);
        })), s.statistic && "1020,1035,1043,1037".indexOf(t.scene) > -1 && wx.reportAnalytics("enter_miniprogram", {
            appid: t.referrerInfo.appId,
            scene: t.scene
        });
    }), I(t);
}, Page = function() {
    for (var e = new wx.Common(), n = arguments.length, a = Array(n), r = 0; r < n; r++) a[r] = arguments[r];
    a.forEach(function(t) {
        wx.deepAssign(e, t);
    }), e.__createRelatives(e.listCount, e.everyCount), wx.decorator(e, "onLoad", function(e) {
        var n = this;
        for (var a in e) e[a] = decodeURIComponent(e[a]);
        i(this), this.onLogin && s.login.open && (wx.userInfo.userID ? this.onLogin(e) : wx.loginPromise.then(function(t) {
            n.onLogin(e);
        })), wx.config.isCustomNav && 1 === getCurrentPages().length && this.setData(t({}, "topNav.isShareEntry", !0));
    }), S(e);
};