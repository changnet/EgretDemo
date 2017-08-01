class LoginPage extends egret.DisplayObjectContainer {
    private enterGameButton: egret.Bitmap;

    constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE,this.onAdd,this);
    }

    private onAdd() {
        var wid = UIManager.gameWidth;
        var hei = UIManager.gameHeight;

        var bgImage = new egret.Bitmap();
        bgImage.texture = RES.getRes("ui/bg.jpg");
        this.addChild(bgImage);

        var gameName = new egret.Bitmap();
        gameName.texture = RES.getRes("ui/ui.json#logo");
        gameName.x = wid*0.5 - gameName.width*0.5; // 左右居中
        gameName.y = hei*0.5 - gameName.height*0.5 - gameName.height;
        this.addChild(gameName);

        var newGameBut = this.enterGameButton = new egret.Bitmap();
        newGameBut.texture = RES.getRes("ui/ui.json#menu")
        newGameBut.x = wid*0.5 - newGameBut.width*0.5;
        newGameBut.y = gameName.y + gameName.height + 220;
        this.addChild(newGameBut);

        var powerByEgret = new egret.Bitmap();
        powerByEgret.texture = RES.getRes("ui/gameUI.json#powerByEgert3D.png");
        powerByEgret.x = bgImage.width - powerByEgret.width;
        powerByEgret.y = this.stage.stageHeight - powerByEgret.height;
        this.addChild(powerByEgret);

        this.enterGameButton.touchEnabled = true;
        this.enterGameButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);

    }

    private onButtonClick(e: egret.TouchEvent): void {
        var roomPage = new RoomPage();
        uiManager.showPage(roomPage);
    }
}