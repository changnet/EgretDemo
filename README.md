# EgretDemo
My game demo for learning egret. Base on egret demo(http://developer.egret.com/cn/article/index/id/1074).

# Note
* 版本升级4.0.1升4.1.0：egret upgrade
* 升级后编译工程会提示4.0.1module找不到，这是因为新版本egret允许同一工程使用
  不同版本模块，因为部分模块仍使用旧版本模块，并没有转换。在egretProperties.json找到对应的模块，把path去掉，这样就会使用当前版本的模块。
* 提示canPick字段不存在，这是因为egret改版后去掉了这个字段，直接把这行代码去掉
* 重新编译，即可运行
* 函数主入口在Main.ts，通用事件ADDED_TO_STAGE调用onAddToStage
* js的"原型链"（prototype chain）模式，来实现继承
* js的装饰器 ???
* egret的文件加载由index.html里加载所有js，包括module，并且由egret build命令自动生成。这样整个项目中不需要import或require。http://edn.egret.com/cn/article/index/id/643
* bin/resourcemanager是一个资源加载库（https://github.com/egret-labs/resourcemanager）。但不知道为什么没放到module里去
* 通用鼠标事件PickEvent3D.PICK_DOWN来实现移动

寻路算法:  
https://my.oschina.net/u/1859679/blog/1486636  
复杂地形寻路：  
(Recast & Detour)https://github.com/recastnavigation/recastnavigation  
B星算法：  
http://www.mamicode.com/info-detail-841620.html  


游戏地图的划分及其优劣性，这里包括(https://www.zhihu.com/question/20298134)：  
Grid (方格)  
Navigation Mesh(导航网格)  

