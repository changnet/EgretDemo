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
        "mp3": "sound"
    }

    var ext = path.substr(path.lastIndexOf(".") + 1);

    // 在ui目录下，一个合并后的png素材由一张png图片和一个json文件组成。这个json必须解析为egret.SpriteSheet对象
    if (path.indexOf("ui/") >= 0) {
        if ("json" == ext) {
            return "sheet"
        }
    }
    if (ext in typeMap) {
        return typeMap[ext]
    }

    return "unit";
})

class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    async preloadRes(){
        // 进入协程
        try{
            await RES.loadConfig();  // 初始化res
            await RES.getResAsync("ui/gameUI.json");
            await RES.getResAsync("ui/bg.jpg");
            await RES.getResAsync("ui/ui.png");
        }
        catch(e){
            console.error(e);
        }

        // 退出协程

        // 异步加载资源
        let resource = [
            "ShadowPlane.png",
            "config/equip_weapon.json"
        ]

        // 上面加载完loading界面所需要的资源后，显示loading界面并加载游戏的其他资源
        let loadingPage = new LoadingPage(resource,this.onResComplete,this);
        uiManager.showPage(loadingPage);
    }

    public onAddToStage(){
        if (egret.Capabilities.isMobile){
            this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDE;
        }
        else{
            this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        }

        uiManager = new UIManager(this);

        // 注意，这个函数会进入协程
        this.preloadRes();
    }

    private onResComplete() {
        // 加载完资源，显示login界面
        console.log("res load complete")
    }
}