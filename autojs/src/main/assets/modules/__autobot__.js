module.exports = function (__runtime__, scope) {
  importPackage(Packages["okhttp3"]);
  // console.log("屏幕方向发生改变,当前方向:" + value);
  function ScreenInfo() {
    this.width = iScreenInfo.width;
    this.height = iScreenInfo.height;
    this.rotation = iScreenInfo.rotation;
    this.isLandscape = this.mRotation == 1 || this.mRotation == 3;
  }
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
    mClipTextChangeListenr: null,
    mOrentationChangeListenr: null,
    mNotificationChangeListenr: null,
    mScreenChangeListenr: null,
  };
  autobot.addErrorListener = function (listener) {
    this.mErrorListener = listener;
  };
  autobot.resetWebSocket = function () {
    this._wsConnected = false;
    if (this.mWs) {
      this.mWs = null;
      try {
        this.mWs.cancel();
      } catch (e) {}
      try {
        this.mWs.close(1, "");
      } catch (e) {}
    }
    try {
      clearInterval(this.mWsHearBeatInterval);
    } catch (e) {}
  };
  autobot._startHeartBeat = function () {
    this.mWsHearBeatInterval = setInterval(() => {
      this.mWs.send("");
    }, 2000);
  };
  autobot._waitConnect = function () {
    if (this._wsConnected) {
      return;
    }
    for (let i = 0; i < 10; i++) {
      sleep(1000);
      if (this._wsConnected) {
        return;
      }
    }
    this.resetWebSocket();
    throw new Error("链接超时");
  };
  autobot.wsSend = function (obj) {
    this._waitConnect();
    let para = JSON.stringify(obj);
    try {
      this.mWs.send(para);
    } catch (e) {
      console.warn(e);
    }
  };
  autobot._onScreenChange = function (imageData) {
    if (this.mScreenChangeListenr) {
      this.mScreenChangeListenr(imageData);
    }
  };
  autobot._onNotificationChange = function (message) {
    if (this.mNotificationChangeListenr) {
      this.mNotificationChangeListenr(message);
    }
  };

  autobot._onClipTextChange = function (message) {
    if (this.mClipTextChangeListenr) {
      this.mClipTextChangeListenr(message);
    }
  };

  autobot._onScreenOrentationChange = function (screenInfo) {
    if (this.mOrentationChangeListenr) {
      this.mOrentationChangeListenr(
        screenInfo.width,
        screenInfo.height,
        screenInfo.rotation,
        screenInfo.isLandscape()
      );
    }
  };
  autobot.addClipTextChangeListener = function (func) {
    this.mClipTextChangeListenr = func;
  };
  autobot.addScreenOrentationChangeListener = function (func) {
    this.mOrentationChangeListenr = func;
  };

  autobot.addNotificationChangeListener = function (func) {
    this.mNotificationChangeListenr = func;
  };

  autobot.addScreenChangeListener = function (func) {
    this.mScreenChangeListenr = func;
  };

  autobot.initWebSocket = function () {
    this.resetWebSocket();
    var client = new OkHttpClient.Builder()
      .retryOnConnectionFailure(true)
      .build();
    var request = new Request.Builder().url(this.wsUrl).build(); //vscode  插件的ip地址，
    client.dispatcher().cancelAll(); //清理一次
    var _that = this;
    let myListener = {
      onOpen: function (webSocket, response) {
        print("WebSocket open");
        _that._wsConnected = true;
        //打开链接后，发送心跳包
        _that._startHeartBeat();
      },
      onMessage: function (webSocket, msg) {
        //msg可能是字符串，也可能是byte数组，取决于服务器送的内容
        if (typeof msg == "string") {
          let { action, value } = JSON.parse(msg);
          switch (action) {
            case 1:
              _that._onScreenOrentationChange(screenInfo);
              break;
            case 2:
              _that._onNotificationChange(value);
              break;
            case 3:
              _that._onClipTextChange(value);
              break;
          }
        } else {
          _that._onScreenChange(msg);
        }
      },
      onClosing: function (webSocket, code, response) {
        print("WebSocket closing");
      },
      onClosed: function (webSocket, code, response) {
        print("WebSocket closed");
      },
      onFailure: function (webSocket, t, response) {
        print("WebSocket err");
        print(t);
      },
    };
    this.mWs = client.newWebSocket(request, new WebSocketListener(myListener));
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
      let newUrl = query ? `${url}?${query}` : url;
      try {
        r = http.get(newUrl, { headers: headers });
      } catch (e) {
        console.error(e);
      }
    } else if (prop.method == "post") {
      let data = prop.data || {};
      try {
        r = http.post(url, data, { headers: headers });
      } catch (e) {
        console.error(e);
      }
    } else {
      throw new Error("method is not get or post");
    }
    if (r) {
      try {
        let res = r.body.json();
        if (res.data.code === 0 && this.mErrorListener) {
          this.mErrorListener(res.data.msg);
        }
      } catch (e) {}
    }
    return r;
  };
  autobot.hello = function () {
    const axiosResponse = this._request({
      url: this.urlMap["hello"],
      method: "get",
      params: para,
    });
    return !!axiosResponse.data;
  };
  autobot.version = function () {
    const axiosResponse = this._request({
      url: this.urlMap["version"],
      method: "get",
      params: para,
    });
    return axiosResponse.data;
  };
  autobot.getActiveInfo = function () {
    const axiosResponse = this._request({
      url: this.urlMap["getActiveInfo"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.getDeviceId = function () {
    const axiosResponse = this._request({
      url: this.urlMap["getDeviceId"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.screenInfo = function () {
    const axiosResponse = this._request({
      url: this.urlMap["screenInfo"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.getSystemInfo = function (ara) {
    const axiosResponse = this._request({
      url: this.urlMap["getSystemInfo"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.screenJson = function () {
    const axiosResponse = this._request({
      url: this.urlMap["screenJson"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.screenXml = function () {
    const axiosResponse = this._request({
      url: this.urlMap["screenXml"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.screenShotBase64 = function () {
    const axiosResponse = this._request({
      url: this.urlMap["screenShotBase64"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.screenShot = function () {
    // const result=this.urlMap["screenShot"]
    const axiosResponse = this._request({
      url: this.urlMap["screenShot"],
      method: "get",
      params: para,
      responseType: "arraybuffer",
    });
    return axiosResponse.data.bytes();
  };
  autobot.screenRotation = function () {
    const axiosResponse = this._request({
      url: this.urlMap["screenRotation"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.getAllContact = function () {
    const axiosResponse = this._request({
      url: this.urlMap["getAllContact"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.deleteContact = function () {
    const axiosResponse = this._request({
      url: this.urlMap["deleteContact"],
      method: "get",
      params: para,
    });
    return Number(axiosResponse.data.data);
  };
  autobot.getClipText = function () {
    const axiosResponse = this._request({
      url: this.urlMap["getClipText"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.startRecoreScreen = function () {
    const axiosResponse = this._request({
      url: this.urlMap["startRecoreScreen"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data == "1";
  };
  autobot.stopRecoreScreen = function () {
    const axiosResponse = this._request({
      url: this.urlMap["stopRecoreScreen"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data == "1";
  };
  autobot.turnScreenOff = function () {
    const axiosResponse = this._request({
      url: this.urlMap["turnScreenOff"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data == "1";
  };
  autobot.exit = function (para) {
    this._request({
      url: this.urlMap["exit"],
      method: "get",
      params: para,
    });
  };
  autobot.checkNotification = function () {
    const axiosResponse = this._request({
      url: this.urlMap["checkNotification"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data == "1";
  };
  autobot.getIp = function () {
    const axiosResponse = this._request({
      url: this.urlMap["getIp"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.getAllSms = function (number) {
    number = number || "*";
    const axiosResponse = this._request({
      url: this.urlMap["getAllSms"],
      method: "get",
      params: { number: number },
    });
  };
  autobot.deleteSms = function (number) {
    number = number || "*";
    const axiosResponse = this._request({
      url: this.urlMap["deleteSms"],
      method: "get",
      params: { number: number },
    });
    return Number(axiosResponse.data.data);
  };
  autobot.download = function (para) {
    /* const axiosResponse = this._request({
      url: this.urlMap["download"],
      method: "get",
      params: para,
    }); */
  };
  autobot.downloadUrl = function (path) {
    const baseDownloadUrl = this.urlMap["download"];
    return baseDownloadUrl + "?path=" + encodeURIComponent(path);
  };
  autobot.getDisplayName = function () {
    const axiosResponse = this._request({
      url: this.urlMap["getDisplayName"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.getTopActivity = function () {
    const axiosResponse = this._request({
      url: this.urlMap["getTopActivity"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.getStartActivity = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["getStartActivity"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.data.data;
  };
  autobot.startPackage = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["startPackage"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.stopPackage = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["stopPackage"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.clearPackage = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["clearPackage"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.getAllPackage = function () {
    const axiosResponse = this._request({
      url: this.urlMap["getAllPackage"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data;
  };
  autobot.getPackageInfo = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["getPackageInfo"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.data.data;
  };
  autobot.stopMusic = function () {
    const axiosResponse = this._request({
      url: this.urlMap["stopMusic"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data == "1";
  };
  autobot.cancelAllNotifications = function () {
    const axiosResponse = this._request({
      url: this.urlMap["cancelAllNotifications"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data == "1";
  };
  autobot.callPhone = function (number) {
    const axiosResponse = this._request({
      url: this.urlMap["callPhone"],
      method: "get",
      params: { number: number },
    });
    return axiosResponse.data.data;
  };
  autobot.endCall = function () {
    const axiosResponse = this._request({
      url: this.urlMap["endCall"],
      method: "get",
      params: para,
    });
    return axiosResponse.data.data == "1";
  };

  //上传文件
  autobot.upload = function (formData, config) {
    /* config = config || {};
    const axiosResponse = this._request(
      Object.assign(
        {
          url: this.urlMap["upload"],
          method: "post",
          data: formData,
        },
        config
      )
    );
    return axiosResponse.data.data; */
  };
  autobot.uploadUrl = function () {
    const baseUploadUrl = this.urlMap["upload"];
    return baseUploadUrl;
  };
  //post提交
  autobot.active = function (value) {
    const axiosResponse = this._request({
      url: this.urlMap["active"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: value },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.inputText = function (value) {
    const axiosResponse = this._request({
      url: this.urlMap["inputText"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: value },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.inputChar = function (value) {
    const axiosResponse = this._request({
      url: this.urlMap["inputChar"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: value },
    });
    return axiosResponse.data.data == "1";
  };

  autobot.execCmd = function (shell, timeout) {
    timeout = timeout || 5;
    const axiosResponse = this._request({
      url: this.urlMap["execCmd"],
      headers: {
        timeout: timeout * 1000 + 1000,
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: {
        value: shell,
        timeout: timeout,
      },
    });
    return axiosResponse.data.data;
  };

  autobot.pressKeyCode = function (keyCode) {
    const axiosResponse = this._request({
      url: this.urlMap["pressKeyCode"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: keyCode },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.insertContact = function (name, phoneNumber) {
    const axiosResponse = this._request({
      url: this.urlMap["insertContact"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: {
        name: name,
        number: phoneNumber,
      },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.gestures = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["gestures"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
    return axiosResponse.data.data == "1";
  };
  autobot.gesture = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["gesture"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
    return axiosResponse.data.data == "1";
  };
  autobot.emptyDir = function (path) {
    const axiosResponse = this._request({
      url: this.urlMap["emptyDir"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: path },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.delFile = function (path) {
    const axiosResponse = this._request({
      url: this.urlMap["emptyDir"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: path },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.listFile = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["listFile"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: path },
    });
    return axiosResponse.data.data;
  };
  autobot.sendSms = function (phoneNumber, content) {
    const axiosResponse = this._request({
      url: this.urlMap["sendSms"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: {
        phoneNumber: phoneNumber,
        value: content,
      },
    });
    return axiosResponse.data.data == "1";
  };

  autobot.setDisplayName = function (displayName) {
    const axiosResponse = this._request({
      url: this.urlMap["setDisplayName"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: {
        value: displayName,
      },
    });
    return axiosResponse.data.data == "1";
  };
  autobot.playMusic = function (musicUrl) {
    const axiosResponse = this._request({
      url: this.urlMap["playMusic"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: musicUrl },
    });
    return axiosResponse.data.data == "1";
  };

  return autobot;
};
