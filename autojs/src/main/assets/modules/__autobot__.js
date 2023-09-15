module.exports = function (__runtime__, scope) {
  var urlMap = {
    hello: "/hello",
    version: "/version",
    getActiveInfo: "/getActiveInfo",
    getDeviceId: "/getDeviceId",
    screenInfo: "/screenInfo",
    getSystemInfo: "/getSystemInfo",
    screenJson: "/screenJson",
    screenXml: "/screenXml",
    screenShotBase64: "/screenShotBase64",
    screenShot: "/screenShot",
    screenRotation: "/screenRotation",
    getAllContact: "/getAllContact",
    deleteContact: "/deleteContact",
    getClipText: "/getClipText",
    startRecoreScreen: "/startRecoreScreen",
    stopRecoreScreen: "/stopRecoreScreen",
    turnScreenOff: "/turnScreenOff",
    exit: "/exit",
    checkNotification: "/checkNotification",
    getIp: "/getIp",
    getAllSms: "/getAllSms",
    deleteSms: "/deleteSms",
    download: "/download",
    getDisplayName: "/getDisplayName",
    getTopActivity: "/getTopActivity",
    getStartActivity: "/getStartActivity",
    startPackage: "/startPackage",
    stopPackage: "/stopPackage",
    clearPackage: "/clearPackage",
    getAllPackage: "/getAllPackage",
    getPackageInfo: "/getPackageInfo",
    stopMusic: "/stopMusic",
    cancelAllNotifications: "/cancelAllNotifications",
    callPhone: "/callPhone",
    endCall: "/endCall",
    upload: "/upload",
    inputText: "/inputText",
    execCmd: "/execCmd",
    inputChar: "/inputChar",
    pressKeyCode: "/pressKeyCode",
    insertContact: "/insertContact",
    gestures: "/gestures",
    gesture: "/gesture",
    emptyDir: "/emptyDir",
    delFile: "/delFile",
    sendSms: "/sendSms",
    listFile: "/listFile",
    setDisplayName: "/setDisplayName",
    playMusic: "/playMusic",
    exit: "/exit",
  };
  var autobot = {
    isSSL: false,
    baseServerUrl: "http://127.0.0.1:18080",
    baseWsUrl: "ws://127.0.0.1:18080",
    wsUrl: "",
    urlMap: {},
    mErrorListener: null,
  };
  autobot.addErrorListener = function (listener) {
    this.mErrorListener = listener;
  };
  autobot.init = function () {
    Object.keys(urlMap).forEach((key) => {
      this.urlMap[key] = `${this.baseServerUrl}/api${urlMap[key]}`;
    });
    this.wsUrl = `${this.baseWsUrl}/api/screen`;
  };
  autobot.init();
  //ip, port, isSSL
  autobot.changeDevice = function (host, isSSL) {
    this.isSSL = isSSL;
    let protocol = this.isSsl ? "https://" : "http://";
    let wsProtocol = this.isSsl ? "ws://" : "wss://";
    this.baseServerUrl = `${protocol}${baseUrl}`;
    this.baseWsUrl = `${wsProtocol}${host}`;
    this.init();
  };
  autobot._request = function (prop) {
    let prop = prop || {};
    let defaultHeaders = {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    };
    if (prop.headers && prop.headers["Content-Type"]) {
      prop.contentType = prop.headers["Content-Type"];
    }
    let headers = Object.assign(defaultHeaders, prop.headers || {});

    if (!prop.url) throw new Error("url is not null");

    let url = prop.url;
    let r;

    if (prop.method == "get") {
      let params = prop.params || {};
      let query = Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&");
      let url = `${url}?${query}`;
      r = http.get(url, { headers: headers });
    } else if (prop.method == "post") {
      let data = prop.data || {};
      r = http.post(url, data, { headers: headers });
    } else {
      throw new Error("method is not get or post");
    }
    return r;
  };
  autobot.hello = function (para) {
    return this._request({
      url: this.urlMap["hello"],
      method: "get",
      params: para,
    });
  };
  autobot.version = function (para) {
    return this._request({
      url: this.urlMap["version"],
      method: "get",
      params: para,
    });
  };
  autobot.getActiveInfo = function (para) {
    return this._request({
      url: this.urlMap["getActiveInfo"],
      method: "get",
      params: para,
    });
  };
  autobot.getDeviceId = function (para) {
    return this._request({
      url: this.urlMap["getDeviceId"],
      method: "get",
      params: para,
    });
  };
  autobot.screenInfo = function (para) {
    return this._request({
      url: this.urlMap["screenInfo"],
      method: "get",
      params: para,
    });
  };
  autobot.getSystemInfo = function (para) {
    return this._request({
      url: this.urlMap["getSystemInfo"],
      method: "get",
      params: para,
    });
  };
  autobot.screenJson = function (para) {
    return this._request({
      url: this.urlMap["screenJson"],
      method: "get",
      params: para,
    });
  };
  autobot.screenXml = function (para) {
    return this._request({
      url: this.urlMap["screenXml"],
      method: "get",
      params: para,
    });
  };
  autobot.screenShotBase64 = function (para) {
    return this._request({
      url: this.urlMap["screenShotBase64"],
      method: "get",
      params: para,
    });
  };
  autobot.screenShot = function (para) {
    // return this.urlMap["screenShot"]
    return this._request({
      url: this.urlMap["screenShot"],
      method: "get",
      params: para,
      responseType: "arraybuffer",
    });
  };
  autobot.screenRotation = function (para) {
    return this._request({
      url: this.urlMap["screenRotation"],
      method: "get",
      params: para,
    });
  };
  autobot.getAllContact = function (para) {
    return this._request({
      url: this.urlMap["getAllContact"],
      method: "get",
      params: para,
    });
  };
  autobot.deleteContact = function (para) {
    return this._request({
      url: this.urlMap["deleteContact"],
      method: "get",
      params: para,
    });
  };
  autobot.getClipText = function (para) {
    return this._request({
      url: this.urlMap["getClipText"],
      method: "get",
      params: para,
    });
  };
  autobot.startRecoreScreen = function (para) {
    return this._request({
      url: this.urlMap["startRecoreScreen"],
      method: "get",
      params: para,
    });
  };
  autobot.stopRecoreScreen = function (para) {
    return this._request({
      url: this.urlMap["stopRecoreScreen"],
      method: "get",
      params: para,
    });
  };
  autobot.turnScreenOff = function (para) {
    return this._request({
      url: this.urlMap["turnScreenOff"],
      method: "get",
      params: para,
    });
  };
  autobot.exit = function (para) {
    return this._request({
      url: this.urlMap["exit"],
      method: "get",
      params: para,
    });
  };
  autobot.checkNotification = function (para) {
    return this._request({
      url: this.urlMap["checkNotification"],
      method: "get",
      params: para,
    });
  };
  autobot.getIp = function (para) {
    return this._request({
      url: this.urlMap["getIp"],
      method: "get",
      params: para,
    });
  };
  autobot.getAllSms = function (para) {
    return this._request({
      url: this.urlMap["getAllSms"],
      method: "get",
      params: para,
    });
  };
  autobot.deleteSms = function (para) {
    return this._request({
      url: this.urlMap["deleteSms"],
      method: "get",
      params: para,
    });
  };
  autobot.download = function (para) {
    return this._request({
      url: this.urlMap["download"],
      method: "get",
      params: para,
    });
  };
  autobot.downloadUrl = function () {
    return this.urlMap["download"];
  };
  autobot.getDisplayName = function (para) {
    return this._request({
      url: this.urlMap["getDisplayName"],
      method: "get",
      params: para,
    });
  };
  autobot.getTopActivity = function (para) {
    return this._request({
      url: this.urlMap["getTopActivity"],
      method: "get",
      params: para,
    });
  };
  autobot.getStartActivity = function (para) {
    return this._request({
      url: this.urlMap["getStartActivity"],
      method: "get",
      params: para,
    });
  };
  autobot.startPackage = function (para) {
    return this._request({
      url: this.urlMap["startPackage"],
      method: "get",
      params: para,
    });
  };
  autobot.stopPackage = function (para) {
    return this._request({
      url: this.urlMap["stopPackage"],
      method: "get",
      params: para,
    });
  };
  autobot.clearPackage = function (para) {
    return this._request({
      url: this.urlMap["clearPackage"],
      method: "get",
      params: para,
    });
  };
  autobot.getAllPackage = function (para) {
    return this._request({
      url: this.urlMap["getAllPackage"],
      method: "get",
      params: para,
    });
  };
  autobot.getPackageInfo = function (para) {
    return this._request({
      url: this.urlMap["getPackageInfo"],
      method: "get",
      params: para,
    });
  };
  autobot.stopMusic = function (para) {
    return this._request({
      url: this.urlMap["stopMusic"],
      method: "get",
      params: para,
    });
  };
  autobot.cancelAllNotifications = function (para) {
    return this._request({
      url: this.urlMap["cancelAllNotifications"],
      method: "get",
      params: para,
    });
  };
  autobot.callPhone = function (para) {
    return this._request({
      url: this.urlMap["callPhone"],
      method: "get",
      params: para,
    });
  };
  autobot.endCall = function (para) {
    return this._request({
      url: this.urlMap["endCall"],
      method: "get",
      params: para,
    });
  };

  //上传文件
  autobot.upload = function (para, config) {
    config = config || {};
    return this._request(
      Object.assign(
        {
          url: this.urlMap["upload"],
          method: "post",
          data: para,
        },
        config
      )
    );
  };
  autobot.uploadUrl = function () {
    return this.urlMap["upload"];
  };
  //post提交
  autobot.active = function (para) {
    return this._request({
      url: this.urlMap["active"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.inputText = function (para) {
    return this._request({
      url: this.urlMap["inputText"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.execCmd = function (para) {
    return this._request({
      timeout: para.timeout * 1000 + 1000,
      url: this.urlMap["execCmd"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.inputChar = function (para) {
    return this._request({
      url: this.urlMap["inputChar"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.pressKeyCode = function (para) {
    return this._request({
      url: this.urlMap["pressKeyCode"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.insertContact = function (para) {
    return this._request({
      url: this.urlMap["insertContact"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.gestures = function (para) {
    return this._request({
      url: this.urlMap["gestures"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.gesture = function (para) {
    return this._request({
      url: this.urlMap["gesture"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.emptyDir = function (para) {
    return this._request({
      url: this.urlMap["emptyDir"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.delFile = function (para) {
    return this._request({
      url: this.urlMap["emptyDir"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.sendSms = function (para) {
    return this._request({
      url: this.urlMap["sendSms"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.listFile = function (para) {
    return this._request({
      url: this.urlMap["listFile"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.setDisplayName = function (para) {
    return this._request({
      url: this.urlMap["setDisplayName"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  autobot.playMusic = function (para) {
    return this._request({
      url: this.urlMap["playMusic"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
  };
  return autobot;
};
