/**
 * autobot无需无障碍，通过在adb shell和root shell或集成在系统内，运行一个服务端调用androidAPI，毫秒级的相应速度
 * autobot文档: http://doc.tntok.top
 * @param {*} __runtime__
 * @param {*} scope
 * @returns
 */
module.exports = function (__runtime__, scope) {
  importPackage(Packages["jsoup"]);//org.jsoup
  importPackage(Packages["okhttp3"]);
  importClass(org.jsoup.Jsoup);
  const cheerio = require("cheerio");
  function ScreenInfo(iScreenInfo) {
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
    clearText: "/clearText",
    startRecoreScreen: "/startRecoreScreen",
    stopRecoreScreen: "/stopRecoreScreen",
    turnScreenOff: "/turnScreenOff",
    turnScreenOn: "/turnScreenOn",
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
    click: "/click",
    longClick: "/longClick",
    press: "/press",
    swipe: "/swipe",
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
  //默认访问本机的18080端口
  var autobot = {
    isSSL: false,
    baseServerUrl: "http://127.0.0.1:18080",
    baseWsUrl: "ws://127.0.0.1:18080",
    wsUrl: "",
    urlMap: {},
    _mWsHearBeatInterval: false,
    _wsConnected: false,
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
      clearInterval(this._mWsHearBeatInterval);
    } catch (e) {}
  };
  autobot._startHeartBeat = function () {
    this._mWsHearBeatInterval = setInterval(() => {
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
              _that._onScreenOrentationChange(new ScreenInfo(value));
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
    /*     if (prop.headers && prop.headers["Content-Type"]) {
      prop.contentType = prop.headers["Content-Type"];
    } */
    let contentType =
      prop.headers && prop.headers["Content-Type"]
        ? prop.headers["Content-Type"]
        : null;
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
        r = http.get(newUrl, { headers: headers, contentType: contentType });
      } catch (e) {
        console.error(e);
      }
    } else if (prop.method == "post") {
      let data = prop.data || {};
      try {
        r = http.post(url, data, {
          headers: headers,
          contentType: contentType,
        });
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
  autobot.hello = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["hello"],
      method: "get",
      params: para,
    });
    return !!axiosResponse.body.string();
  };
  autobot.version = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["version"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.string();
  };
  autobot.getActiveInfo = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["getActiveInfo"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.getDeviceId = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["getDeviceId"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.screenInfo = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["screenInfo"],
      method: "get",
      params: para,
    });
    let info = axiosResponse.body.json().data;
    return new ScreenInfo(info);
  };
  autobot.getSystemInfo = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["getSystemInfo"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.screenJson = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["screenJson"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.screenXml = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["screenXml"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.screenShotBase64 = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["screenShotBase64"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.screenShot = function (para) {
    // const result=this.urlMap["screenShot"]
    const axiosResponse = this._request({
      url: this.urlMap["screenShot"],
      method: "get",
      params: para,
      responseType: "arraybuffer",
    });
    return axiosResponse.body.bytes();
  };
  autobot.screenRotation = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["screenRotation"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.getAllContact = function (phoneNumber) {
    phoneNumber = phoneNumber || "*";
    const axiosResponse = this._request({
      url: this.urlMap["getAllContact"],
      method: "get",
      params: {
        number: phoneNumber,
      },
    });
    return axiosResponse.body.json().data;
  };
  autobot.deleteContact = function (phoneNumber) {
    const axiosResponse = this._request({
      url: this.urlMap["deleteContact"],
      method: "get",
      params: {
        number: phoneNumber,
      },
    });
    return Number(axiosResponse.body.json().data);
  };
  autobot.getClipText = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["getClipText"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.clearText = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["clearText"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.startRecoreScreen = function (limit) {
    const axiosResponse = this._request({
      url: this.urlMap["startRecoreScreen"],
      method: "get",
      params: { limit: limit },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.stopRecoreScreen = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["stopRecoreScreen"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.turnScreenOff = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["turnScreenOff"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.turnScreenOn = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["turnScreenOn"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.exit = function (para) {
    this._request({
      url: this.urlMap["exit"],
      method: "get",
      params: para,
    });
  };
  autobot.checkNotification = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["checkNotification"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.getIp = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["getIp"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.getAllSms = function (phoneNumber) {
    phoneNumber = phoneNumber || "*";
    const axiosResponse = this._request({
      url: this.urlMap["getAllSms"],
      method: "get",
      params: { number: phoneNumber },
    });
    return axiosResponse.body.json().data;
  };
  autobot.deleteSms = function (phoneNumber) {
    phoneNumber = phoneNumber || "*";
    const axiosResponse = this._request({
      url: this.urlMap["deleteSms"],
      method: "get",
      params: { number: phoneNumber },
    });
    return Number(axiosResponse.body.json().data);
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
  autobot.getDisplayName = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["getDisplayName"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.getTopActivity = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["getTopActivity"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.getStartActivity = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["getStartActivity"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.body.json().data;
  };
  autobot.startPackage = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["startPackage"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.stopPackage = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["stopPackage"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.clearPackage = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["clearPackage"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.getAllPackage = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["getAllPackage"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data;
  };
  autobot.getPackageInfo = function (packageName) {
    const axiosResponse = this._request({
      url: this.urlMap["getPackageInfo"],
      method: "get",
      params: { packageName: packageName },
    });
    return axiosResponse.body.json().data;
  };
  autobot.stopMusic = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["stopMusic"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.cancelAllNotifications = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["cancelAllNotifications"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.callPhone = function (number) {
    const axiosResponse = this._request({
      url: this.urlMap["callPhone"],
      method: "get",
      params: { number: number },
    });
    return axiosResponse.body.json().data;
  };
  autobot.endCall = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["endCall"],
      method: "get",
      params: para,
    });
    return axiosResponse.body.json().data == "1";
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
    return axiosResponse.body.json().data; */
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
    return axiosResponse.body.json().data == "1";
  };
  autobot.inputText = function (text) {
    const axiosResponse = this._request({
      url: this.urlMap["inputText"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: text },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.inputChar = function (charText) {
    const axiosResponse = this._request({
      url: this.urlMap["inputChar"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: charText },
    });
    return axiosResponse.body.json().data == "1";
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
    return axiosResponse.body.json().data;
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
    return axiosResponse.body.json().data == "1";
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
    return axiosResponse.body.json().data == "1";
  };
  autobot.click = function (x, y) {
    const axiosResponse = this._request({
      url: this.urlMap["click"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { x: x, y: y },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.longClick = function (x, y) {
    const axiosResponse = this._request({
      url: this.urlMap["longClick"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { x: x, y: y },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.press = function (x, y, duration) {
    const axiosResponse = this._request({
      url: this.urlMap["press"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { x: x, y: y, duration: duration },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.swipe = function (x1, y1, x2, y2, duration) {
    const axiosResponse = this._request({
      url: this.urlMap["swipe"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        duration: duration,
      },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot._gestures = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["gestures"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot._gesture = function (para) {
    const axiosResponse = this._request({
      url: this.urlMap["gesture"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: para,
    });
    return axiosResponse.body.json().data == "1";
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
    return axiosResponse.body.json().data == "1";
  };
  autobot.delFile = function (path) {
    const axiosResponse = this._request({
      url: this.urlMap["delFile"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: path },
    });
    return axiosResponse.body.json().data == "1";
  };
  autobot.listFile = function (path) {
    const axiosResponse = this._request({
      url: this.urlMap["listFile"],
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      method: "post",
      data: { value: path },
    });
    return axiosResponse.body.json().data;
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
    return axiosResponse.body.json().data == "1";
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
    return axiosResponse.body.json().data == "1";
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
    return axiosResponse.body.json().data == "1";
  };

  //上边都是httpapi，下边对参数做autox.js适配
  autobot.startApp = function (packageName) {
    if (packageName.includes("/")) {
      const mingling = `am start -n ${packageName}`;
      return this.execCmd(mingling);
    } else {
      return this.startPackage(packageName);
    }
  };
  autobot.installApk = function (apkPath) {
    if (!files.exists(apkPath)) {
      throw new Error("apk file not found");
    }
    // let fileName=files.getName(apkPath)
    let newPath = `/data/local/tmp/waitInstall.apk`;
    const mingling = `mv '${apkPath}' '${newPath}'\npm install -r -d '${newPath}'\nrm '${newPath}'`;
    return this.execCmd(mingling);
  };
  autobot.unInstallApp = function (packageName) {
    const mingling = `pm uninstall ${packageName}`;
    return this.execCmd(mingling);
  };
  autobot.killApp = function (packageName) {
    return this.stopPackage(packageName);
  };
  autobot.tap = function (x, y) {
    return this.click(x, y);
  };
  autobot.inputKey = function (keyCode) {
    return this.pressKeyCode(keyCode);
  };
  autobot.execAdbShell = function (shellStr) {
    return this.execCmd(shellStr);
  };
  autobot.timeout = function (timeout) {
    sleep(timeout);
  };
  autobot.timeout2 = function (startTime, endTime) {
    let time = Math.floor(Math.random() * (endTime - startTime) + startTime);
    sleep(time * 1000);
  };
  autobot.gesture = function () {
    if (arguments.length < 2) throw new Error("gesture函数至少需要2个参数");
    let para = {
      duration: 0,
      points: [],
    };
    if (typeof arguments[0] != "number") {
      throw new Error("gesture函数第一个参数必须为number类型");
    }
    para.duration = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
      let point = arguments[i];
      if (point.length != 2) {
        throw new Error("point必须同时包含x，y");
      }
      para.points.push({
        x: point[0],
        y: point[1],
      });
    }
    return this._gesture(para);
  };
  //多指手势
  autobot.gestures = function () {
    if (!arguments.length) throw new Error("gestures函数至少需要1个参数");
    const resultPara = [];
    for (let gesture of arguments) {
      let para = {
        delay: 0,
        duration: 0,
        points: [],
      };
      let startIndex = 2;
      if (typeof gesture[1] == "number") {
        para.delay = gesture[0];
        para.duration = gesture[1];
        startIndex = 2;
      } else {
        para.duration = gesture[0];
        startIndex = 1;
      }
      for (let i = startIndex; i < gesture.length; i++) {
        let point = gesture[i];
        if (point.length != 2) {
          throw new Error("point必须同时包含x，y");
        }
        para.points.push({
          x: point[0],
          y: point[1],
        });
      }
      resultPara.push(para);
    }
    return this._gestures(resultPara);
  };
  autobot.getScreenDocument = function () {
    let xmlStr = this.screenXml();
    // console.log(xmlStr);
    let doc = cheerio.load(xmlStr, {
      normalizeWhitespace: true,
      xmlMode: true,
    });
    return doc;
  };
  autobot.getScreenDocument2 = function () {
      for(let i=0;i<3;i++){
          try{
              let xmlStr = this.screenXml();
              let doc = Jsoup.parse(xmlStr);
              return doc;
          }catch(e){}
      }
      console.error(`加载文档失败：${selector}`);
  };
  //切换到jsoup来进行查找，这里使用cheerio对于一些复杂屏幕布局来说太慢了
  autobot.querySelectorAll = function (selector, option) {
    option = option || {};
    //对百分比的region进行转换
    if (option.region) {
      let { x1: sx1, y1: sy1, x2: sx2, y2: sy2 } = option.region;
      if (sx1 <= 1 || sy1 <= 1 || sx2 <= 1 || sy2 <= 1) {
        let screenInfo = this.screenInfo();
        let [x1, y1, x2, y2] = convertRegion(
          screenInfo.width,
          screenInfo.height,
          option.region
        );
        option.region = {
          x1,
          y1,
          x2,
          y2,
        };
      }
    }
    let startTime=Date.now();
    const $ = this.getScreenDocument2();
    let nodes = [];
    try {
//      nodes = $(`${selector}`);
        nodes=$.select(selector)
    } catch (e) {
      console.error(`查找出错：${selector}`);
      return;
    }
    let result = [];
    for (let i = 0; i < nodes.length; i++) {
      let item = nodes[i];

      /*let bounds = $(item).attr("bound");
      let text = $(item).attr("text");*/
      let bounds =item.attr("bound");
      let text = item.attr("text");
      bounds = bounds.split(",").map((item) => {
        let wz = parseInt(item);
        return isNaN(wz) ? 0 : wz;
      });
      let [x1, y1, x2, y2] = bounds;
      if (option.region) {
        let { x1: rx1, y1: ry1, x2: rx2, y2: ry2 } = option.region;
        if (!(x1 >= rx1 && y1 >= ry1 && x1 < rx2 && y1 < ry2)) {
          continue;
        }
      }
      let itemObj={}
      let mx = Math.round(x1 + (x2 - x1) / 2);
      let my = Math.round(y1 + (y2 - y1) / 2);
      itemObj.bounds = {
        mx,
        my,
        x1,
        y1,
        x2,
        y2,
      };
      itemObj.text = text;
//      itemObj.sObj = item
      result.push(itemObj);
    }
    let endTime=Date.now();
    let execTime=endTime-startTime;
    console.log(`用时${execTime}ms,选择器${selector},查找到的元素个数${result.length}`)
    return result;
  };
  autobot.querySelector = function (selector, option) {
    option = option || {};
    const result = this.querySelectorAll(selector, option);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  };
  autobot.waitForSelector = function (selector, option) {
    option = option || {};
    let retry = option.retry || 10;
    for (let i = 0; i < retry; i++) {
      let nodes = this.querySelectorAll(selector, option);
      if (nodes.length > 0) {
        return true;
      }
      sleep(500);
    }
    console.error(`未找到${selector}对应的元素`);
    return false;
  };
  autobot.findTextAll = function (searchStr, option) {
    option = option || {};
    let selector;
    if (searchStr.includes("$")) {
      searchStr = searchStr
        .split("$")
        .filter(Boolean)
        .map((item) => {
          return option.accurate ? `[text="${item}"]` : `[text*="${item}"]`;
        })
        .join();
      selector = "*" + searchStr;
    } else {
      selector = option.accurate
        ? `*[text="${searchStr}"]`
        : `*[text*="${searchStr}"]`;
    }
    let nodes = this.querySelectorAll(selector, option);
    return nodes;
  };
  autobot.findText = function (selector, option) {
    option = option || {};
    const result = this.findTextAll(selector, option);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  };
  autobot.waitForText = function (searchStr, option) {
    option = option || {};
    let retry = option.retry || 10;
    for (let i = 0; i < retry; i++) {
      let nodes = this.findTextAll(searchStr, option);
      if (nodes.length > 0) {
        return true;
      }
      sleep(500);
    }
    console.error(`未找到文本:(${searchStr})对应的元素`);
    return false;
  };

  autobot.captureScreen = function () {
    return images.load(this.urlMap["screenShot"]);
  };

  autobot.findImage = function (base64Img, option) {
    option = option || {};
    option.max = 5;
    let srcImg = this.captureScreen();
    let tmpImg = images.fromBase64(base64Img);
    if (option.region) {
      option.region = convertRegion(
        srcImg.getWidth(),
        srcImg.getHeight(),
        option.region
      );
    }
    const result = images.matchTemplate(srcImg, tmpImg, option);
    const resultArr = [];
    result.matches.forEach(function (match) {
      resultArr.push({
        confidence: match.similarity,
        result: {
          x: match.point.x,
          y: match.point.y,
          width: match.rect.width,
          height: match.rect.height,
          mx: Math.round(match.point.x + match.rect.width / 2),
          my: Math.round(match.point.y + match.rect.height / 2),
        },
      });
    });
    return resultArr;
  };

  autobot.findColor = function (color, option) {
    option = option || {};
    let srcImg = this.captureScreen();
    if (option.region) {
      option.region = convertRegion(
        srcImg.getWidth(),
        srcImg.getHeight(),
        option.region
      );
    }
    return images.findColor(srcImg, color, option);
  };

  autobot.findAllPointsForColor = function (color, option) {
    option = option || {};
    let srcImg = this.captureScreen();
    if (option.region) {
      option.region = convertRegion(
        srcImg.getWidth(),
        srcImg.getHeight(),
        option.region
      );
    }
    return images.findAllPointsForColor(srcImg, color, option);
  };
  autobot.findMultiColors = function (firstColor, paths, option) {
    option = option || {};
    let srcImg = this.captureScreen();
    if (option.region) {
      option.region = convertRegion(
        srcImg.getWidth(),
        srcImg.getHeight(),
        option.region
      );
    }
    return images.findMultiColors(srcImg, firstColor, paths, option);
  };

  function convertRegion(sw, sh, region) {
    let { x1, y1, x2, y2 } = region;
    let { sx1, sy1 } = getScreenXY(sw, sh, x1, y1);
    let { sx1: sx2, sy1: sy2 } = getScreenXY(sw, sh, x2, y2);
    let xx2 = Math.round(sx2 - sx1);
    let yy2 = Math.round(sy2 - sy1);
    return [sx1, sy1, xx2, yy2];
  }
  function getScreenXY(sw, sh, x, y) {
    let screenWidth = sw;
    let screenHeight = sh;
    let sx1 = x;
    let sy1 = y;
    if (x <= 1) {
      sx1 = Math.round(screenWidth * x);
    }
    if (y <= 1) {
      sy1 = Math.round(screenHeight * y);
    }
    return {
      sx1,
      sy1,
    };
  }
  return autobot;
};
