class MiniMap extends egret.DisplayObjectContainer {

    constructor(conf: any) {
        super();

        // 背景
        var bgImage = new egret.Bitmap();
        bgImage.texture = RES.getRes("ui/ui.json#" + conf["min_map"]);
        this.addChild(bgImage);
        bgImage.x = 10
        bgImage.y = 10

        // 边框
        var frame = new egret.Bitmap();
        frame.texture = RES.getRes("ui/ui.json#bk");
        this.addChild(frame);
    }
}


class RoomPage extends egret.DisplayObjectContainer {

    constructor() {
        super();

        this.once(egret.Event.ADDED_TO_STAGE,this.onAdd,this);
    }

    private onAdd() {
        var bgImage = new egret.Bitmap();
        bgImage.texture = RES.getRes("ui/bg.jpg");
        this.addChild(bgImage);

        var title = new egret.Bitmap();
        title.texture = RES.getRes("ui/ui.json#title");
        title.x = this.stage.stageWidth*0.5 - title.width*0.5;
        title.x = 100
        this.addChild(title);

        var index: number = 0;
        var disX = 40;
        var disY = 280;
        var conf = confManager.getConf("config/map_scene.json")

        for (let sceneConf of conf) {
            let minMap = new MiniMap(sceneConf);
            minMap.x = disX + Math.floor(index % 2)*310;
            minMap.y = disY + Math.floor(index / 2)*230;

            this.addChild(minMap);
            index ++;
        }
    }
}