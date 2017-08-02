class MiniMap extends egret.DisplayObjectContainer {
    private _lock: egret.Bitmap;
    private _width: number;
    private _star: egret.Bitmap[];

    constructor(conf: any) {
        super();
        this._star = [];

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

        this._width = bgImage.width;

        this.lock = true;
        this.star = 4;
    }

    public set lock(value: boolean) {
        if (!this._lock) {
            this._lock = new egret.Bitmap();
            this._lock.texture = RES.getRes("ui/ui.json#suo")
            this._lock.x = this.width * 0.5 - this._lock.width * 0.5
            this._lock.y = this.height * 0.5 - this._lock.height * 0.5

            this.addChild(this._lock)
        }
        this._lock.visible = value;
    }

    public set star(value: number) {
        // 创建足够的星星
        for ( var idx = this._star.length;idx < value;idx ++ ) {
            let oneStar = new egret.Bitmap();
            oneStar.texture = RES.getRes("ui/ui.json#star")

            // 设置绝对锚点X。坐标x = oneStar.x - oneStar.anchorOffsetX
            //oneStar.anchorOffsetX = oneStar.width / 2;

            // 每颗星之前相隔2像素
            oneStar.x = 25 + idx * (oneStar.width + 2);
            oneStar.y = 0

            this._star.push(oneStar);
            this.addChild(oneStar);
        }
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