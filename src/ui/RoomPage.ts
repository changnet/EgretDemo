class MiniMap extends egret.DisplayObjectContainer {
    private _lock: egret.Bitmap;
    private frameWidth: number;
    private _star: egret.Bitmap[];
    private _sceneID: number;

    constructor(conf: any,starNum: number) {
        super();
        this._star = [];

        this._sceneID = conf.id

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

        this.frameWidth = frame.width;

        this.lock = (1 == this._sceneID % 2);
        this.star = starNum;
    }

    public set lock(value: boolean) {
        if (!this._lock) {
            this._lock = new egret.Bitmap();
            this._lock.texture = RES.getRes("ui/ui.json#suo")
            this._lock.x = this.width * 0.5 - this._lock.width * 0.5
            this._lock.y = this.height * 0.5 - this._lock.height * 0.5

            this.addChild(this._lock)
        }
        this.touchEnabled = !value  // 开启触摸事件，否则无法触发TOUCH_TAP事件
        this._lock.visible = value;
    }

    public set star(value: number) {
        // 创建足够的星星
        var space: number = 2; // 每颗星之前相隔2像素
        var startX: number = 0;
        for ( var idx = this._star.length;idx < value;idx ++ ) {
            let oneStar = new egret.Bitmap();
            oneStar.texture = RES.getRes("ui/ui.json#star")

            // 设置绝对锚点X。坐标x = oneStar.x - oneStar.anchorOffsetX
            //oneStar.anchorOffsetX = oneStar.width / 2;

            // 计算出星星的总宽度,无论多少颗星星，总是居中对齐
            if (!startX) {
                var starWidth = value*oneStar.width + (value - 1)*space
                startX = this.frameWidth * 0.5 - starWidth * 0.5
            }

            oneStar.x = startX + idx * (oneStar.width + space);
            oneStar.y = 8

            this._star.push(oneStar);
            this.addChild(oneStar);
        }
    }

    public get sceneID(): number {
        return this._sceneID;
    }
}


class RoomPage extends egret.DisplayObjectContainer {

    private mapList: MiniMap[];

    constructor() {
        super();
        this.mapList = [];

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
            let miniMap = new MiniMap(sceneConf,index > 4 ? 4 : index);
            miniMap.x = disX + Math.floor(index % 2)*310;
            miniMap.y = disY + Math.floor(index / 2)*230;

            this.addChild(miniMap);
            this.mapList.push(miniMap);
            index ++;
        }
    }

    private onMiniMapClick(e: egret.TouchEvent): void {
        var miniMap: MiniMap = e.target as MiniMap;

        // change to map scene
        if ( !sceneManager ) {
            sceneManager = new SceneManager();
        }

        sceneManager.enterScene(miniMap.sceneID);
    }

    public onEnterPage(): void {
        for ( let miniMap of this.mapList ) {
            miniMap.addEventListener(
                egret.TouchEvent.TOUCH_TAP,this.onMiniMapClick,this);
        }
    }

    public onLeavePage():void {
        for ( let miniMap of this.mapList ) {
            miniMap.removeEventListener(
                egret.TouchEvent.TOUCH_TAP,this.onMiniMapClick,this);
        }
    }
}