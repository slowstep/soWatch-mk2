"use strict";

var tabs = require("sdk/tabs");
var version = require("sdk/self").version;
var repository = "https://github.com/jc3213/soWatch-mk2/releases/";

exports.upgrade = function () {
  tabs.open(repository + version);
};