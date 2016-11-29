"use strict";

function makeRegExp (string) {
  var pattern = string.replace(/\//g, "\\/").replace(/\?/g, "\\?").replace(/\./g, "\\.").replace(/\*/g, ".*");
  return new RegExp(pattern, "i");
}

function worker (data) {
  if (typeof data == "string") {
    return makeRegExp(rule);
  } else {
    return data;
  }	
}

exports.encode = function (data) {
  if (typeof data == "array") {
    var array = new Array();
    data.forEach(function (element, index, array) {
      var rule = element[0];
      var pattern = worker(rule);
      array.push(pattern);
    }
    return array;
  ) else (
    return worker(data);
  )
};
