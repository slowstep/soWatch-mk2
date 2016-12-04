"use strict";

function makeRegExp (string) {
  var pattern = string.replace(/\//g, "\\/").replace(/\?/g, "\\?").replace(/\./g, "\\.").replace(/\*/g, ".*");
  return new RegExp(pattern, "i");
}

exports.encode = function (data) {
  if (typeof data == "string") {
    return makeRegExp(data);
  } else {
    return data;
  }	
};
