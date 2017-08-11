
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"3thlibs/resourcemanager/resourcemanager.js",
	"libs/modules/egret3d/egret3d.js",
	"polyfill/promise.js",
	"bin-debug/entity/Entity.js",
	"bin-debug/entity/Animal.js",
	"bin-debug/scene/SceneManager.js",
	"bin-debug/entity/Monster.js",
	"bin-debug/entity/Player.js",
	"bin-debug/Main.js",
	"bin-debug/scene/NavGrid.js",
	"bin-debug/scene/Scene.js",
	"bin-debug/conf/ConfManager.js",
	"bin-debug/ui/BattlePage.js",
	"bin-debug/ui/components/ProcessBar.js",
	"bin-debug/ui/components/SkillBar.js",
	"bin-debug/ui/LoadingPage.js",
	"bin-debug/ui/LoginPage.js",
	"bin-debug/ui/RoomPage.js",
	"bin-debug/ui/UIManager.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 60,
		scaleMode: "showAll",
		contentWidth: 640,
		contentHeight: 1136,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};