"use strict";

var Storage = require("../lib/storage.js");
var Preference = require("../lib/pref-utils.js");
var Services = require("../lib/services.js");
var Worker = require("./worker.js");
var Locales = require("sdk/l10n").get;
var {Cu} = require("chrome");
var {CustomizableUI} = Cu.import("resource:///modules/CustomizableUI.jsm", {});

var iconShown = false;
var cssFile = Services.io.newURI(require("sdk/self").data.url("toolbar.css"), null, null);
var MenuItem = { player: "_options.Player", filter: "_options.Filter", none: "_options.None" };

function createButton(document) {
  var button = document.createElement("toolbarbutton");
  button.setAttribute("id", "sowatchmk2-button");
  button.setAttribute("class", "toolbarbutton-1");
  button.setAttribute("type", "menu");
  button.setAttribute("label", "soWatch! mk2");

  var popup = document.createElement("menupopup");
  popup.setAttribute("id", "sowatchmk2-popup");
  popup.addEventListener("click", menuClick, false);
  popup.addEventListener("popupshowing", menuPopup, false);
  button.appendChild(popup);

  createPopupMenu(document, popup);

  return button;
}

function createPopupMenu(document, popup) {
  Storage.option.menuitem.forEach(function (element, index, array) {
    createTopItem(document, popup, element);

    if (index < array.length - 1) {
      var separator = document.createElement("menuseparator");
      separator.setAttribute("id", "sowatchmk2-separator-" + index);
      popup.appendChild(separator);
    }
  });

  for (var i in Storage.website) {
    var separator = document.createElement("menuseparator");
    separator.setAttribute("id", "sowatchmk2-separator-" + i);
    popup.appendChild(separator);

    var menu = document.createElement("menu")
    menu.setAttribute("id", "sowatchmk2-" + i);
    menu.setAttribute("label", Locales(i + "_title"));
    menu.setAttribute("class", "menu-iconic");
    popup.appendChild(menu);

    var param = { name: i, player: Storage.website[i].hasPlayer, filter: Storage.website[i].hasFilter };

    createSubItem(document, menu, param);
  }
}

function createTopItem(document, popup, param) {
  param.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    var item = document.createElement("menuitem");
    item.setAttribute("id", "sowatchmk2-" + name);
    item.setAttribute("class", "menuitem-iconic");
    if (type == "boolean") {
      item.setAttribute("label", Locales(name + "_title"));
      item.setAttribute("type", "checkbox");
    } else if (type == "command") {
      item.setAttribute("label", Locales(name + "_label"));
    }
    popup.appendChild(item);
  });	
}

function createSubItem(document, menu, param) {
  var popup = document.createElement("menupopup");
  popup.setAttribute("id", "sowatchmk2-" + param.name + "-popup");
  menu.appendChild(popup);

  for (var i in MenuItem) {
    var item = document.createElement("menuitem");
    item.setAttribute("id", "sowatchmk2-" + param.name + "-" + i);
    item.setAttribute("label", Locales(param.name + MenuItem[i]));
    item.setAttribute("type", "radio");
    if (!param.player && i == "player") {
      item.setAttribute("disabled", "true");
    }
    if (!param.filter && i == "filter") {
      item.setAttribute("disabled", "true");
    }
    popup.appendChild(item);
  }
}

function menuClick(event) {
  Storage.option.command.forEach(function (element, index, array) {
    var name = element[0], type = element[1];
    if (event.target.id == "sowatchmk2-" + name) {
      if (type == "command") {
        Worker[name]();
      } else if (type == "boolean") {
        if (Storage.option.prefs[name].value) {
          Preference.setValue(Storage.option.prefs[name].prefs.name, false);
        } else {
          Preference.setValue(Storage.option.prefs[name].prefs.name, true);
        }
      }
    }
  });

  for (var i in Storage.website) {
    var website = Storage.website[i];
    if (event.target.id == "sowatchmk2-" + i + "-player") {
      if (!website.hasPlayer) continue;
      Preference.setValue(website.prefs.name, 1);
    } else if (event.target.id == "sowatchmk2-" + i + "-filter") {
      if (!website.hasFilter) continue;
      Preference.setValue(website.prefs.name, 2);
    } else if (event.target.id == "sowatchmk2-" + i + "-none") {
      Preference.setValue(website.prefs.name, 0);
    }
  }
}

function menuPopup(event) {
  if (event.target.id == "sowatchmk2-popup") {
    Storage.option.command.forEach(function (element, index, array) {
      var name = element[0], type = element[1];
      if (type == "boolean") {
        if (Storage.option.prefs[name].value) {
          event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "true");
        } else {
          event.target.querySelector("#sowatchmk2-" + name).setAttribute("checked", "false");
        }
      }
    });

    for (var i in Storage.website) {
      var website = Storage.website[i];
      if (website.value == 1) {
        event.target.querySelector("#sowatchmk2-" + i + "-player").setAttribute("checked", "true");
      } else if (website.value == 2) {
        event.target.querySelector("#sowatchmk2-" + i + "-filter").setAttribute("checked", "true");
      } else if (website.value == 0) {
        event.target.querySelector("#sowatchmk2-" + i + "-none").setAttribute("checked", "true");
      }
    }
  }
}

exports.create = function () {
  if (iconShown) return;
  CustomizableUI.createWidget({
    id: "sowatchmk2-button",
    type: "custom",
    defaultArea: CustomizableUI.AREA_NAVBAR,
    onBuild: createButton
  });
  Services.sss.loadAndRegisterSheet(cssFile, Services.sss.AUTHOR_SHEET);
  iconShown = true;
};
exports.remove = function () {
  if (!iconShown) return;
  Services.sss.unregisterSheet(cssFile, Services.sss.AUTHOR_SHEET);
  CustomizableUI.destroyWidget("sowatchmk2-button");
  iconShown = false;
};
