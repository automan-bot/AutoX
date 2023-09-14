module.exports = function (__runtime__, scope) {
  var autobot = {};
  autobot.show = function () {
    var r = http.get("www.baidu.com");
    log("code = " + r.statusCode);
    log("html = " + r.body.string());
  };
  return autobot;
};
