// 用装饰器语法装饰resourcemanager的mapConfig函数
// 此函数似乎同时用于res build命令(https://github.com/egret-labs/resourcemanager/tree/master/docs)
// 存在一个全局唯一的资源配置文件，并通过 res build 命令自动生成，生成的文件名为RES.mapConfig的第一个参数所对应的文件名
// 每当资源文件发生变化时，需要重新执行res build
// 当 res build 命令执行后，会遍历 resource文件夹，并将其中的每一个文件执行 RES.mapConfig的第三个参数所指向的函数，如果该
// 文件返回 undefined ，则此文件不会被加入到资源配置文件中。

@RES.mapConfig("default.res.json", () => "resource", path => {
    var typeMap = {
        "jpg": "image",
        "png": "image",
        "webp": "image",
        "json": "json",
        "fnt": "font",
        "pvr": "pvr",
        "mp3": "sound",
    }

    var ext = path.substr(path.lastIndexOf(".") + 1);

    // 在ui目录下，一个合并后的png素材由一张png图片和一个json文件组成。
    // 这个json必须解析为egret.SpriteSheet对象才能通过RES.getRes("ui/ui.json#title");这种方式获取资源
    if (path.indexOf("ui/") >= 0) {
        if ("json" == ext) {
            return "sheet"
        }
    }
    if (ext in typeMap) {
        return typeMap[ext]
    }

    // 这个游戏中的一些3D资源的加载，如e3dpack、nav等地图、动画、导航网格资源
    return "unit";
})

class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();

        this.registerResProcess();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    // 注册自定义类型的资源处理接口
    private registerResProcess():void {
        // resourcemanager的接口已定义好
        // https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor

        let promisify = (loader: egret3d.UnitLoader, url: string) => {
            return new Promise((reslove, reject) => {
                loader.addEventListener(egret3d.LoaderEvent3D.LOADER_COMPLETE, () => {
                    reslove(loader.data);
                }, this);

                loader.load("resource/" + url);
            });
        }

        // RES.processor.map(type,object)
        // object包含三个函数：onLoadStart、onRemoveStart、getData
        RES.processor.map("unit", {

            onLoadStart: async (host, resource) => {
                var loader = new egret3d.UnitLoader();
                return promisify(loader, resource.url)
            },

            onRemoveStart: async (host, resource) => Promise.resolve()
        });
    }

    async preloadRes(){
        // 进入协程
        try{
            await RES.loadConfig();  // 初始化res
            await RES.getResAsync("ShadowPlane.png");
            await RES.getResAsync("ui/gameUI.json");
            await RES.getResAsync("ui/bg.jpg");
            await RES.getResAsync("ui/ui.png");
            await RES.getResAsync("ui/ui.json")
        }
        catch(e){
            console.error(e);
        }

        // 退出协程
        confManager.preloadRes();
    }

    public onAddToStage(){
        if (egret.Capabilities.isMobile){
            this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDE;
        }
        else{
            this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        }

        uiManager = new UIManager(this);
        confManager = new ConfManager();
        confManager.addEventListener(ConfEvent.CONF_LOADED,this.onResComplete,this);

        // 注意，这个函数会进入协程
        this.preloadRes();

        // 初始化3D参数 egret3d是一个单例
        // 将舞台从2d转换为3d
        // 没初始化会导致3d组件不可用，报Cannot read property 'STATIC_DRAW' of undefined
        var stage3d = new egret3d.Stage3D(this.stage);
        egret.setRendererContext(stage3d);
        egret3d.Egret3DEngine.instance.useDevicePOLICY(0);
        egret3d.Egret3DEngine.instance.debug = false;
        egret3d.Egret3DPolicy.useAnimPoseInterpolation = true;
        egret3d.Egret3DPolicy.useAnimMixInterpolation = true;
        egret3d.Egret3DPolicy.useParticle = true;
        egret3d.Egret3DPolicy.useLowLoop = true;

        // View3D是Egre3D中的显示窗口，我们在View3D对象初始化的时候，需要填写的四个参数分别为窗口的x，y和宽高值。
        // backColor是当前显示窗口的背景颜色。需要注意的是，其中颜色值为ARGB，不要忘记前两位为Alpha信息。
        // 最后我们设置其当前View3D中摄像机的位置与朝向，并将其添加到egret3d.Egret3DCanvas对象中。
        // 加上view3D后，要把index.html中的帧率改为60以上，不然屏幕闪烁严重
        var view3d = new egret3d.View3D(0,0,stage3d.width,stage3d.height);
        stage3d.addView3D(view3d);
        uiManager.view = view3d;
    }

    public onResComplete(ev: ConfEvent) {
        // 加载完资源，显示login界面
        var loginPage = new LoginPage();
        uiManager.showPage(loginPage);
    }
}