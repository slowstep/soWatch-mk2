"use strict";

exports.option = [
  ["restore", null, "command", false, 0],
  ["button", true, "boolean", false, null],
  ["update", 0, "integer", true, null],
  ["period", 8, "integer", false, null],
  ["download", null, "command", false, 2],
  ["offline", true, "boolean", false, 1],
  ["server", "", "string", true, null],
  ["folder", "", "string", true, null]
];
exports.website = [
  [
    "youku",
    0,
    "youku.com",
    [
      ["player", "loader.swf", false, "http://static.youku.com/*/v/swf/loader*.swf*"],
      ["player", "player.swf", false, "http://static.youku.com/*/v/swf/*player*.swf*"],
      ["filter", true, "http://*.atm.youku.com/v*?vip=*"]
    ]
  ],
  [
    "tudou",
    0,
    "tudou.com",
    [
      ["player", "tudou.swf", false, "http://js.tudouui.com/bin/lingtong/PortalPlayer*.swf*"],
      ["filter", false, "http://*.atm.youku.com/v*?vip=*"]
    ]
  ],
  [
    "iqiyi",
    0,
    "iqiyi.com",
    [
      ["player", "iqiyi5.swf", false, "http://www.iqiyi.com/common/flashplayer/*/MainPlayer*.swf*"],
      ["player", "iqiyi5.swf", false, "http://www.iqiyi.com/common/flashplayer/*/*f98c2359.swf*"],
      ["player", "iqiyi_out.swf", false, "http://www.iqiyi.com/common/flashplayer/*/EnjoyPlayer*.swf*"],
      ["filter", false, /http:\/\/(\d+\.){3}\d+\/videos\/other(\/[^\/]+){3}\/[^\.]+.f4v/i],
      ["filter", false, "http://data.video.qiyi.com/videos/other/*/*/*/*.hml*"]
    ]
  ],
  [
    "letv",
    0,
    "le.com",
    [
      ["player", "letv.swf", false, "http://player.letvcdn.com/*/*/*/*/*/*/newplayer/LetvPlayer.swf*"],
      ["player", "letv.swf", false, "http://player.letvcdn.com/*/*/*/*/newplayer/SDKLetvPlayer.swf*"],
      ["player", "http://www.le.com/cmsdata/playerapi/pccs_sdk_20141113.xml", true, "http://www.le.com/cmsdata/playerapi/pccs_PlayerSDK*.xml*"],
      ["player", "http://www.le.com/cmsdata/playerapi/pccs_sdk_20141113.xml", true, "http://www.le.com/cmsdata/playerapi/pccs_LiveSDK*.xml*"],
      ["player", "http://www.le.com/cmsdata/playerapi/pccs_sdk_20141113.xml", true, "http://www.le.com/cmsdata/playerapi/pccs_main*.xml"],
      ["filter", false, /http:\/\/(\d+\.){3}(\d+\/){4}letv-gug\/[^\/]+\/ver_.+avc.+aac.+\.mp4/i],
      ["filter", false, "http://i*.letvimg.com/lc0*_gugwl/*/*/*/*/*"],
      ["filter", false, "http://i*.letvimg.com/lc0*_diany/*/*/*/*/*"]
    ]
  ],
  [
    "sohu",
    0,
    "sohu.com",
    [
      ["player", "sohu_live.swf", false, "http://tv.sohu.com/upload/swf/*/Main.swf*"],
      ["filter", false, "http://v.aty.sohu.com/v*"]
    ]
  ],
  [
    "pptv",
    0,
    "pptv.com",
    [
      ["player", "player4player2.swf", false, "http://player.pplive.cn/ikan/*/player4player2.swf*"],
      ["filter", false, "http://de.as.pptv.com/ikandelivery/vast/*draft/*"]
    ]
  ]
];
exports.wrapper = [
  ["filter", "youku", ["tudou"]]
];
