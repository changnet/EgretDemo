class Main extends egret.DisplayObjectContainer {

    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    public onAddToStage(){
        if (egret.Capabilities.isMobile){
            this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDE;
        }
        else{
            this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        }

    }
}