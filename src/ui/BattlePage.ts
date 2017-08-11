class BattlePage extends egret.DisplayObjectContainer {

    private static ratio: number = 0.8;
    private expBar: ProcessBar;
    private skillBar: SkillBar;
    private returnButton: egret.Bitmap;


    constructor() {
        super();

        var width = UIManager.gameWidth;
        var height = UIManager.gameHeight;

        var title = new egret.Bitmap();
        title.texture = RES.getRes("ui/gameUI.json#scene_100000.png")
        title.x = 0;
        title.y = 0;
        title.scaleX = title.scaleY = BattlePage.ratio;
    }
}