class BattlePage extends egret.DisplayObjectContainer {

    private static ratio: number = 0.8;
    private expBar: ProcessBar;
    private skillBar: SkillBar;
    private returnButton: egret.Bitmap;


    constructor() {
        super();

        var width = UIManager.gameWidth;
        var height = UIManager.gameHeight;

        // 场景标题
        var title = new egret.Bitmap();
        title.texture = RES.getRes("ui/gameUI.json#scene_100000.png")
        title.x = 0;
        title.y = 0;
        title.scaleX = title.scaleY = BattlePage.ratio;
        this.addChild(title);

        // 返回按钮
        var returnButton = new egret.Bitmap();
        returnButton.texture = RES.getRes("ui/gameUI.json#fh.png");
        returnButton.x = width - returnButton.width + 20;
        returnButton.y = height - returnButton.height - 100;
        returnButton.scaleX = returnButton.scaleY = 0.8;
        this.returnButton = returnButton;
        this.addChild(returnButton);
        returnButton.touchEnabled = true;

        // 经验条
        var expBar = new ProcessBar(
            "ui/gameUI.json#hpbar_bg.png","ui/gameUI.json#expbar.png");
        expBar.height = 10;
        expBar.width = 96*4;
        expBar.x = (width - expBar.width)/2; // 左右居中
        expBar.y = (height - expBar.height); // 上下放最低下
        this.expBar = expBar;
        this.addChild(expBar);

        // 技能栏
        var skillBar = new SkillBar(96,96);
        skillBar.x = (width - skillBar.width)/2;    // 左右居中
        skillBar.y = height - skillBar.height - 10; // 放在经验条上面
        this.skillBar = skillBar;
        this.addChild(skillBar);

        // test
        skillBar.addSkill(
            "ui/gameUI.json#skilla.png","ui/gameUI.json#SkillBox.png",10000);
    }

    onEnterPage(): void {
        this.returnButton.addEventListener(
            egret.TouchEvent.TOUCH_TAP, this.onReturn, this);
    }

    onLeavePage(): void {
        this.returnButton.removeEventListener(
            egret.TouchEvent.TOUCH_TAP, this.onReturn, this);
    }

    private onReturn() {

    }
}