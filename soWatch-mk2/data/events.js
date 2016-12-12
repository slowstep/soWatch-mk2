"use strict";

var Storage = require("../lib/storage.js");
var Rulelist = require("../lib/rulelist.js");
var FileIO = require("../lib/file-io.js");
var Pattern = require("../lib/makepattern.js");
var Preference = require("../lib/pref-utils.js");
var Worker = require("./worker.js");
var Toolbar = require("./toolbar.js");

function menuAndButton(name, type, order) {
  Storage.option.command.push([name, type]);
  if (Storage.option.menuitem[order]) {
    Storage.option.menuitem[order].push([name, type]);
  } else {
    Storage.option.menuitem[order] = [[name, type]];
  }
}

function readList() {
  Storage.option.config = new Object(), Storage.option.command = new Array(), Storage.option.menuitem = new Array();

  Rulelist.option.forEach(function (element, index, array) {
    var name = element[0], value = element[1], type = element[2], ignore = element[3], order = element[4];
    if (type != "command") {
      Storage.option.config[name] = {
        prefs: {name: name, value: value},
        ignore: ignore
      };
    }

    if (typeof order == "number") {
      if (type == "command" || type == "boolean") {
        menuAndButton(name, type, order);
      }
    }
  });

  Rulelist.website.forEach(function (element, index, array) {
    var name = element[0], value = element[1], address = element[2], option = element[3];
    Storage.website[name] = {
      prefs: {name: name, value: value},
      onSite: Pattern.encode(address),
      option: option
    };
  });
}

function handleWrapper() {
  Rulelist.wrapper.forEach(function (element, index, array) {
    var entry = element[0], major = element[1], minor = element[2];
    minor.forEach(function (element, index, array) {
      major = Storage.website[major], minor = Storage.website[element];
      if (entry == "player") {
        if ((major.value == 1 && minor.value != 1) || (major.value != 1 && minor.value == 1)) {
          Preference.setValue(minor.prefs.name, major.value);
        }
      }
      if (entry == "filter") {
        if ((major.value == 2 && minor.value == 0) || (major.value == 0 && minor.value == 2)) {
          Preference.setValue(minor.prefs.name, major.value);
        }
      }
    });
  });
}

function readOption() {
  for (var i in Storage.option.config) {
    Storage.option.config[i].value = Preference.getValue(Storage.option.config[i].prefs.name);
  }

  Storage.file.folder = Storage.option.config["folder"].value || FileIO.folder + "\\";
  Storage.file.link = Storage.option.config["server"].value || FileIO.server;
  Storage.file.path = FileIO.toURI(Storage.file.folder) + "/";

  Worker.pendingOption();
  handleWrapper();

  if (Storage.option.config["button"].value) {
    Toolbar.create();
  } else {
    Toolbar.remove();
  }

  Worker["download"]("auto");
};

exports.startup = function () {
  readList();
  readOption();
  Preference.addListener("", readOption);
  Storage.option.command.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    if (type == "command") {
      Preference.addListener(name, Worker[name]);
    }
  });
};
exports.shutdown = function () {
  Toolbar.remove();
  Preference.removeListener("", readOption);
  Storage.option.command.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    if (type == "command") {
      Preference.removeListener(name, Worker[name]);
    }
  });
};
