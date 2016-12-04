"use strict";

var Storage = require("../lib/storage.js");
var Pattern = require("../lib/makepattern.js");
var FileIO = require("../lib/file-io.js");
var Preference = require("../lib/pref-utils.js");
var Synchronize = require("../lib/sync.js");

function getRule(option, name, prefix) {
  option.forEach(function (element, index, array) {
    var type = element[0], param = prefix + index;

    if (type == "player") {
      var player = element[1], remote = element[2], string = element[3];

      if (remote) {
        Storage.player[param] = {
          website: name,
          offline: player,
          pattern: Pattern.encode(string)
        };
      } else {
        Storage.player[param] = {
          website: name,
          offline: Storage.file.path + player,
          online: Storage.file.link + player,
          pattern: Pattern.encode(string)
        };
      }
    } else if (type == "filter") {
      var filter = element[1], string = element[2];

      Storage.filter[param] = {
        website: name,
        secured: filter,
        pattern: Pattern.encode(string)
      };
    }
  });
}

exports.pendingOption = function () {
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
  for (var i in Storage.option) {
    if (Storage.option[i].ignore) continue;
    Preference.resetValue(Storage.option[i].prefs);
  }

  for (var x in Storage.website) {
    Preference.resetValue(Storage.website[x].prefs);
  }
};
exports.download = function (state) {
  var when = parseInt(Date.now() / 1000);
  if (state && Storage.option["update"].value > when) return;

  for (var i in Storage.player) {
    if ("online" in Storage.player[i]) {
      var link = Storage.player[i]["online"];
      var file = FileIO.toPath(Storage.player[i]["offline"]);
      Synchronize.fetch(link, file);
    }
  }

  Preference.setValue(Storage.option["update"].prefs.name, when + Storage.option["period"].value * 86400);
};
