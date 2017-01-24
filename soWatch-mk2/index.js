"use strict";

var Events = require("./data/events.js");
var HttpRequest = require("./data/httprequest.js");
var Setup = require("./data/setup.js");

exports.main = function (options, callbacks) {
  Events.startup();
  HttpRequest.addListener();
  if (options.loadReason == "upgrade") {
    Setup.upgrade();
  }
};

exports.onUnload = function (reason) {
  Events.shutdown();
  HttpRequest.removeListener();
};
