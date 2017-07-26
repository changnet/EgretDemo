// 进度条
class ProcessBar extends egret.DisplayObjectContainer{

    private background:egret.Bitmap;
    private bar:egret.Bitmap;
    private _ratio:number;

    constructor(bgImage:string,barImage:string){

        super();

        this.background = new egret.Bitmap();
        this.background.texture = RES.getRes(bgImage);
        this.addChild(this.background);

        this.bar = new egret.Bitmap();
        this.bar.texture = RES.getRes(barImage);
        this.addChild(this.bar);
    }

    set ratio(num:number){
        this._ratio = num;
        this.bar.scaleX = num;
    }

    get ratio():number{
        return this._ratio;
    }

    set width(num:number){
        this.bar.width = this.background.width = num;
    }

    get width():number{
        return this.bar.width;
    }
}