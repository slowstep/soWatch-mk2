"use strict";

var Storage = require("../lib/storage.js");
var Services = require("../lib/services.js");
var {Cc, Ci, Cr, Cu} = require("chrome");
var {NetUtil} = Cu.import("resource://gre/modules/NetUtil.jsm", {});
var statCounter = 0;
var isFlash = /(\.swf|\.xml)/i;

function getFilter(rule, httpChannel) {
  if (rule["secured"]) {
    httpChannel.suspend();
  } else {
    httpChannel.cancel(Cr.NS_BINDING_ABORTED);
  }
}

function getPlayer(object, rule, httpChannel) {
  httpChannel.suspend();
  NetUtil.asyncFetch(object, function (inputStream, status) {
    var binaryOutputStream = Cc["@mozilla.org/binaryoutputstream;1"].createInstance(Ci.nsIBinaryOutputStream);
    var storageStream = Cc["@mozilla.org/storagestream;1"].createInstance(Ci.nsIStorageStream);
    var count = inputStream.available();
    var data = NetUtil.readInputStreamToString(inputStream, count);
    storageStream.init(512, count, null);
    binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
    binaryOutputStream.writeBytes(data, count);
    rule["storageStream"] = storageStream;
    rule["count"] = count;
    httpChannel.resume();
  });
}

function TrackingListener() {
  this.originalListener = null;
  this.rule = null;
}
TrackingListener.prototype = {
  onStartRequest: function (request, context) {
    this.originalListener.onStartRequest(request, context);
  },
  onStopRequest: function (request, context) {
    this.originalListener.onStopRequest(request, context, Cr.NS_OK);
  },
  onDataAvailable: function (request, context) {
    this.originalListener.onDataAvailable(request, context, this.rule["storageStream"].newInputStream(0), 0, this.rule["count"]);
  }
}

var HttpRequest = {
  observe: function (subject, topic, data) {
    if (topic == "http-on-examine-response") {
      HttpRequest.frontEnd(subject);
    }
  },
  frontEnd: function (subject) {
    var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
    HttpRequest.filter(httpChannel);
    if (!isFlash.test(httpChannel.URI.spec)) return;
    HttpRequest.player(subject, httpChannel);
  },
  filter: function (httpChannel) {
    for (var i in Storage.filter) {
      var rule = Storage.filter[i];

      if (!rule.enabled) continue;

      if (rule.pattern.test(httpChannel.URI.spec)) {
        if (rule.website == "iqiyi") { // issue #7 细节补丁
          statCounter ++;
          if (statCounter != 2) {
            getFilter(rule, httpChannel);
          }
        } else {
          getFilter(rule, httpChannel);
        }
      }
    }
  },
  player: function (subject, httpChannel) {
    var offline = Storage.option["offline"].value;

    for (var i in Storage.player) {
      var rule = Storage.player[i], site = Storage.website[rule.website];

      if (site.onSite.test(httpChannel.URI.host)) {
        if (rule.website == "iqiyi") { // issues #7 前置补丁
          statCounter = 0;
        }
        site.popup = true;
      } else {
        site.popup = false;
      }

      if (!rule.enabled) continue;

      if (rule.pattern.test(httpChannel.URI.spec)) {
        if (!rule["storageStream"] || !rule["count"]) {
          if (offline) {
            getPlayer(rule.offline, rule, httpChannel);
          } else {
            getPlayer(rule.online, rule, httpChannel);
          }
        }
        var newListener = new TrackingListener();
        subject.QueryInterface(Ci.nsITraceableChannel);
        newListener.originalListener = subject.setNewListener(newListener);
        newListener.rule = rule;
        break;
      }
    }
  }
};

exports.addListener = function () {
  Services.obs.addObserver(HttpRequest, "http-on-examine-response", false);
};
exports.removeListener = function () {
  Services.obs.removeObserver(HttpRequest, "http-on-examine-response");
};
