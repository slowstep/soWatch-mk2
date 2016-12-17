"use strict";

var Storage = require("../lib/storage.js");
var Preference = require("../lib/pref-utils.js");
var Worker = require("./worker.js");

exports.addListener = function () {
  Storage.option.command.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    if (type == "command") {
      Preference.addListener(name, Worker[name]);
    }
  });
};
exports.removeListener = function () {
  Storage.option.command.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    if (type == "command") {
      Preference.removeListener(name, Worker[name]);
    }
  });
};