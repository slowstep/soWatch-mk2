"use strict";

var tabs = require("sdk/tabs");
var self = require("sdk/self");
var repository = "https://github.com/jc3213/soWatch-mk2/releases/";
var issue = "https://github.com/jc3213/Misc/issues/new?title="
var name = self.name, version = self.version;
var time = new Date();

exports.upgrade = function () {
  tabs.open(repository + version);
};
exports.downgrade = function () {
  tabs.open(issue + name + "+" + version + "+" + time);
}