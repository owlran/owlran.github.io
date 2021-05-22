---
title: 自幹一個鍵盤/滑鼠電量提醒
date: "2020-05-24T19:40:32.169Z"
template: "post"
draft: false
slug: "monitor-battery-with-os-script"
category: "osscript"
tags:
  - "osscript"
description: "透過 crontab + shell script 來監控鍵盤/滑鼠電量"
socialImage: "/media/42-line-bible.jpg"
---

最近比較長時間用 iMac, 偶爾會沒注意到滑鼠或鍵盤快沒電

比較簡單的解決方案會是用 Better touch tool, 但我個人習慣用另一套

所以就透過 crontab + shell script 自己來看就好了.

<!-- more -->

* ioreg
  * [The I/O Registry Explorer
](https://developer.apple.com/library/archive/documentation/DeviceDrivers/Conceptual/IOKitFundamentals/TheRegistry/TheRegistry.html) : 提供給 mac developer 去查看 I/O Kit 註冊的資訊, 可以透過這個來拿鍵盤跟滑鼠的電量。

* osscript
  執行 apple script 的 command.


所以組合起來就會是這個方式

```shell
#!/usr/bin/env bash
PATH=/usr/local/bin:/usr/local/sbin:~/bin:/usr/bin:/bin:/usr/sbin:/sbin

MOUSE_BATT=`ioreg -c AppleDeviceManagementHIDEventService -r -l | grep -i mouse -A 20 | grep BatteryPercent | cut -d= -f2 | cut -d' ' -f2`
KEYBOARD_BATT=`ioreg -c AppleDeviceManagementHIDEventService -r -l | grep -i keyboard -A 20 | grep BatteryPercent | cut -d= -f2 | cut -d' ' -f2`

COMPARE=${1:-20}

if [ -z "$MOUSE_BATT" ]; then
  echo 'No mouse found.'
  exit 0
fi

if (( MOUSE_BATT < COMPARE )); then
  osascript -e "display notification \"Mouse battery is at ${MOUSE_BATT}%.\" with title \"Mouse Battery Low\""
fi

if (( KEYBOARD_BATT < COMPARE )); then
  osascript -e "display notification \"Keyboard battery is at ${KEYBOARD_BATT}%.\" with title \"Keyboard Battery Low\""
fi
~       
```

接著透過 crontab 去定期 monitor 這樣下次就不怕他們沒電了 ！

### Reference
* [Get low battery notifications for mouse earlier](https://apple.stackexchange.com/questions/254703/get-low-battery-notifications-for-mouse-earlier)