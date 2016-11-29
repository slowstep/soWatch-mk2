"use strict";

exports.option = [
  ["restore", "command", false, 0],
  ["button", true, false, null],
  ["update", 0, true, null],
  ["period", 8, false, null],
  ["download", "command", false, 2],
  ["offline", true, false, 1],
  ["server", "", true, null],
  ["folder", "", true, null]
];
exports.website = [
  [
    "youku",
    0,
    /youku\.com/i,
    [true, [["youku_loader", "loader.swf", true, null, /http:\/\/static\.youku\.com\/.*\/v\/swf\/loaders?\.swf/i], ["youku_player", "player.swf", true, null, /http:\/\/static\.youku\.com\/.*\/v\/swf\/q?player.*\.swf/i]]],
    [true, [["youku_filter", null, null, true, /http:\/\/val[fcopb]\.atm\.youku\.com\/v[fcopb]/i]]]
  ],
  [
    "tudou",
    0,
    /tudou\.com/i,
    [true, [["tudou_portal", "tudou.swf", true, null, /http:\/\/js\.tudouui\.com\/bin\/lingtong\/PortalPlayer.*\.swf/i]]],
    [true, [["tudou_filter", null, null, false, /http:\/\/val[fcopb]\.atm\.youku\.com\/v[fcopb]/i]]]
  ],
  [
    "iqiyi",
    0,
    /iqiyi\.com/i,
    [true, [["iqiyi_v5", "iqiyi5.swf", true, null, /http:\/\/www\.iqiyi\.com\/common\/flashplayer\/\d+\/(MainPlayer.*|\w{4}f98c2359)\.swf/i], ["iqiyi_out", "iqiyi_out.swf", true, null, /https?:\/\/www\.iqiyi\.com\/(common\/flash)?player\/\d+\/(Share|Enjoy)?Player.*\.swf/i]]],
    [true, [["iqiyi_filter", null, null, false, /http:\/\/(\w+\.){3}\w+\/videos\/other\/\d+\/(\w{2}\/){2}\w{32}\.(f4v|hml)/i]]]
  ],
  [
    "letv",
    0,
    /le\.com/i,
    [true, [["letv_player", "letv.swf", true, null, /http:\/\/.*\.letv(cdn)?\.com\/.*(new)?player\/((SDK)?Letv|swf)Player\.swf/i], ["letv_pccs", "http://www.le.com/cmsdata/playerapi/pccs_sdk_20141113.xml", false, null, /http:\/\/www\.le\.com\/cmsdata\/playerapi\/pccs_(?!(.*live|sdk)).*_?(\d+)\.xml/i]]],
    [true, [["letv_filter", null, null, false, /http:\/\/(\d+\.){3}\d+\/(\d{1,3}\/){3}letv-gug\/\d{1,3}\/ver.+avc.+aac.+\.mp4/i], ["letv_pause", null, null, false, /http:\/\/i\d\.letvimg\.com\/lc\d+_(gugwl|diany)\/(\d+\/){4}.*\.(jpg|swf)/i]]]
  ],
  [
    "sohu",
    0,
    /sohu\.com/i,
    [true, [["sohu_player", "sohu_live.swf", true, null, /http:\/\/(tv\.sohu\.com\/upload\/swf\/(p2p\/|56\/)?\d+|(\d+\.){3}\d+\/webplayer)\/Main\.swf/i]]],
    [true, [["sohu_filter", null, null, true, /http:\/\/v\.aty\.sohu\.com\/v/i]]]
  ],
  [
    "pptv",
    0,
    /pptv\.com/i,
    [true, [["pptv_player", "player4player2.swf", true, null, /http:\/\/player.pplive.cn\/ikan\/.*\/player4player2\.swf/i]]],
    [true, [["pptv_filter", null, null, false, /http:\/\/de\.as\.pptv\.com\/ikandelivery\/vast\/.+draft/i]]]
  ]
];
exports.wrapper = [
  ["filter", "youku", ["tudou"]]
];
