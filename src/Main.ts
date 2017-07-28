// 用装饰器语法装饰resourcemanager的mapConfig函数
// 此函数似乎同时用于res build命令(https://github.com/egret-labs/resourcemanager/tree/master/docs)
// 存在一个全局唯一的资源配置文件，并通过 res build 命令自动生成，生成的文件名为RES.mapConfig的第一个参数所对应的文件名
// 每当资源文件发生变化时，需要重新执行res build
// 当 res build 命令执行后，会遍历 resource文件夹，并将其中的每一个文件执行 RES.mapConfig的第三个参数所指向的函数，如果该
// 文件返回 undefined ，则此文件不会被加入到资源配置文件中。

@RES.mapConfig("default.res.json", () => "resource", path => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var type = "";
    if (path == "config.json") {
        type = "json";
    } else {
        if (path.indexOf("ui/") >= 0) {
            let ext = path.substr(path.lastIndexOf(".") + 1);
            let typeMap = {
                "jpg": "image",
                "png": "image",
                "webp": "image",
                "json": "json",
                "fnt": "font",
                "pvr": "pvr",
                "mp3": "sound"
            }
            type = typeMap[ext];
            if (type == "json") {
                if (path.indexOf("png") < 0) {
                    type = "sheet";
                } else if (path.indexOf("movieclip") >= 0) {
                    type = "movieclip";
                };
            }
        } else {
            type = "unit";
        }
    }
    return type;
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
            "table/scene.json",
            "table/skills.json",
            "table/wave.json",
            "table/unit.json",
            "table/upgrade.json",
            "table/equip.json"
        ]

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

    onResComplete() {

    }
}