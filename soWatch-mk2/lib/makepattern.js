"use strict";

function makeRegExp (string) {
  var pattern = string.replace(/\//g, "\\/").replace(/\?/g, "\\?").replace(/\./g, "\\.").replace(/\*/g, ".*");
  return new RegExp(pattern, "i");
}

function encode (data) {
  if (typeof data == "string") {
    return makeRegExp(data);
  } else {
    return data;
  }	
}

exports.encode = encode;
exports.encodeX = function (data) {
  var rule = new Array();
  try {
    data.forEach(function (element, index, array) {
      var string = element;
      var pattern = encode(string);
      rule.push(pattern);
    })
  } catch (e) {
    var pattern = encode(data);
    rule.push(pattern);
  }
  return rule;
};
