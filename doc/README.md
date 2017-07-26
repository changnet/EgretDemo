学习过程中的笔记

# 版本转换
* 版本升级4.0.1升4.1.0：egret upgrade
* 升级后编译工程会提示4.0.1module找不到，这是因为新版本egret允许同一工程使用
  不同版本模块，因为部分模块仍使用旧版本模块，并没有转换。在egretProperties.json找到对应的模块，把path去掉，这样就会使用当前版本的模块。
* 提示canPick字段不存在，这是因为egret改版后去掉了这个字段，直接把这行代码去掉
* 重新编译，即可运行

# egret运行流程
见egret.graphtml

# TypeScript
* [可以在constructor中用private关键字指定成员变量
  ](https://www.stevefenton.co.uk/2013/04/stop-manually-assigning-typescript-constructor-parameters/)。
* [namespace与JS里module的区别](http://www.idom.me/articles/838.html)，那主要在于文件上：TS里的namespace是跨文
  件的，JS里的module是以文件为单位的，一个文件一个module
* [aysnc await相当于Lua中的协程。](https://basarat.gitbooks.io/typescript/content/docs/async-await.html)
* promise的写法思想，[参考js的promise](http://javascript.ruanyifeng.com/advanced/promise.html)
* [函数返回类型](https://www.typescriptlang.org/docs/handbook/functions.html)function add(x: number, y: number): number {}
* [默认参数](https://www.typescriptlang.org/docs/handbook/functions.html)function add(x: number, y?: number): number {}
* [getter/setter](http://www.typescriptlang.org/docs/handbook/classes.html)，当只有getter没有setter时，变量是只读的
* 单例模式：在类后面声明一个全局变量，如：let uiManager:UIManager;然后在程序初始化时初始化：uiManager = new UIManager(this);

# egret资源管理
* 全部采用json格式来配置，工具采用Res Depot来管理(PS:这工具没什么用，手动编辑default.res.json或者用egret wing3内置的工具一样)
* 所有资源(图片、音效、动画、配置文件...)都要放在resource目录下
* 先安装node.js,然后安装resourcemanage并使用res build命令，将resource目录下的资源生成配置config.json(取决于mapConfig的参数)
* 在代码中引入resourcemanager模块(见外部TypeScript模块)
* 程序中加载资源使用[resourcemanager模块](http://developer.egret.com/cn/doc/index/extension/RES/newres/index.html)
* 旧模块不要res使用

# egret纹理
* 采用texture merger来管理，把多个纹理合并后生成一个png文件，并且附带生成一个json文件
* 使用RES模块来加载RES.getRes("ui2/gameUI.json#fh.png")，fh.png是合并到gameUI.png中的一个子纹理

# egret引用库
[参考](http://edn.egret.com/cn/article/index/id/172)
## 内部模块，如(egret,res、game、eui...)
* 在egretProperties.json的modules中配置对应的模块名。
* egret build -e命令(即重新构建工程)，引擎会自动把使用到的类库放到你的项目里的libs/modules文件夹.PS:egret wing3居然不会自动刷新工作目录
* resourcemanage不是内部模块，要按外部模块处理
## 外部TypeScript模块
* 下载第三方库,如[resourcemanager](https://github.com/egret-labs/resourcemanager)
* 把下载的库文件(不需要ts文件，只需要.d.ts、js、js.map、min.js)到第三方目录，如3thlibs/resourcemanager
* 在egretProperties.json中添加对应的模块名，指定path