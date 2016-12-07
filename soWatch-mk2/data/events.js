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
  Storage.option.config = new Array(), Storage.option.command = new Array(), Storage.option.menuitem = new Array();

  Rulelist.option.forEach(function (element, index, array) {
    var name = element[0], value = element[1], ignore = element[2], order = element[3];
    if (value != "command") {
      Storage.option.config[name] = {
        prefs: {name: name, value: value},
        ignore: ignore
      };
    }

    if (typeof order == "number") {
      if (value == "command") {
        menuAndButton(name, "command", order);
      } else if (typeof value == "boolean") {
        menuAndButton(name, "boolean", order);
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

  if (Storage.option.config["server"].value) {
    Storage.file.link = Storage.option.config["server"].value;
  } else {
    Storage.file.link = FileIO.server;
  }

  if (Storage.option.config["folder"].value) {
    Storage.file.path = FileIO.toURI(Storage.option.config["folder"].value);
  } else {
    Storage.file.path = FileIO.toURI(FileIO.folder);
  }

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
