"use strict";

var Storage = require("../lib/storage.js");
var Pattern = require("../lib/makepattern.js");
var Preference = require("../lib/pref-utils.js");
var Synchronize = require("../lib/sync.js");

function getRule(option, name, prefix) {
  var queue = new Array();

  option.forEach(function (element, index, array) {
    var type = element[0], param = prefix + index;

    if (type == "player") {
      var player = element[1], mode = element[2], string = element[3];

      if (mode == 1) {
        var offline, online = offline = player;
      } else {
        var offline = Storage.file.path + player, online = Storage.file.server + player, path = Storage.file.folder + player;
        queue.push([online, path]);
      }

      Storage.player[param] = {
        website: name,
        offline: offline,
        online: online,
        pattern: Pattern.encode(string)
      };
    } else if (type == "filter") {
      var mode = element[1], string = element[2];

      Storage.filter[param] = {
        website: name,
        mode: mode,
        pattern: Pattern.encode(string)
      };
    }
  });

  downloadQueue(queue);
}

function downloadQueue(queue) {
  var test = new Object();
  queue.forEach(function (element, index, array) {
    if(!test[element]) {
      test[element] = 1;
      Storage.file.queue.push(element);
    }
  });
}

exports.pendingOption = function () {
  Storage.file.queue = new Array();

  Object.keys(Storage.website).forEach(function (element, index, array) {
    var website = Storage.website[element], param = index * 10;

    website.value = Preference.getValue(website.prefs.name);
    getRule(website.option, element, param);
  });

  for (var i in Storage.player) {
    var param = Storage.player[i].website, website;
    if (website = Storage.website[param]) {
      website.hasPlayer = true;
      if (website.value == 1) {
        Storage.player[i].enabled = true;
      } else {
        Storage.player[i].enabled = false;
      }
    }
  }

  for (var x in Storage.filter) {
    var param = Storage.filter[x].website, website;
    if (website = Storage.website[param]) {
      website.hasFilter = true;
      if (website.value == 2) {
        Storage.filter[x].enabled = true;
      } else {
        Storage.filter[x].enabled = false;
      }
    }
  }
};
exports.restore = function () {
  for (var i in Storage.option.config) {
    if (Storage.option.config[i].ignore) continue;
    Preference.resetValue(Storage.option.config[i].prefs);
  }

  for (var x in Storage.website) {
    Preference.resetValue(Storage.website[x].prefs);
  }
};
exports.download = function (state) {
  var when = parseInt(Date.now() / 1000);
  if (state && Storage.option.config["update"].value > when) return;

  Storage.file.queue.forEach(function (element, index, array) {
    var link = element[0], file = element[1];
    Synchronize.fetch(link, file);
  });

  Preference.setValue(Storage.option.config["update"].prefs.name, when + Storage.option.config["period"].value * 86400);
};
