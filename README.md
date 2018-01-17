# EgretDemo

A egret 2D/3D game demo for learning H5 game development.
Base on egret demo(http://developer.egret.com/cn/article/index/id/1074).

To run this demo,you need to build a game server first.The server is here:https://github.com/changnet/MServer.

# Note

* 使用res而不是resourcemanager，因resourcemanager与eui冲突，且resourcemanager不支持egret wing生成的default.res.json格式
* res读取合并资源是ui_json.logo，而resourcemanager是ui/ui.json#logo
* js的"原型链"（prototype chain）模式，来实现继承
* js的装饰器 ???
* egret的文件加载由index.html里加载所有js，包括module，并且由egret build命令自动生成。这样整个项目中不需要import或require。http://edn.egret.com/cn/article/index/id/643
* bin/resourcemanager是一个资源加载库（https://github.com/egret-labs/resourcemanager）。但不知道为什么没放到module里去
* 通用鼠标事件PickEvent3D.PICK_DOWN来实现移动
* proto.ts文件由工具生成. https://github.com/changnet/SPEditor
* Not consider resources release yet

# TODO

* MVC design

# other H5 game engine

https://phaser.io

