class LoadingPage extends egret.DisplayObjectContainer{
    
    private totalProgress:ProcessBar;
    private _count:number;
    private _total:number;

    constructor(private fileURLS:string[],
        private callbackFun:Function,private callbackObj:any){
        
        super();

        let bgImage = "ui/bg.jpg";
        this.once(egret.Event.ADDED_TO_STAGE,() => {
            this.onAdd(bgImage)
        },this);
    }

    // 初始化加载时的背景及进度条
    private onAdd(bgImage:string){
        var wid = this.stage.stageWidth;
        var hei = this.stage.stageHeight;

        if (bgImage){
            var bg = new egret.Bitmap();
            bg.texture = RES.getRes(bgImage);
            this.addChild(bg);
        }

        this.totalProgress = new ProcessBar(
            "ui/gameUI.json#hpbar_bg.png","ui/gameUI.json#expbar.png");
        this.totalProgress.width = wid - 100;
        this.totalProgress.height = 10;
        this.totalProgress.ratio = 0;
        this.totalProgress.x = 50;
        this.totalProgress.y = (hei - this.totalProgress.height) * 0.5 - 10;
        this.addChild(this.totalProgress);
    }

    public onEnterPage() {

        // 把fileURLS里的每个元素中的resource/替换为空串
        this.fileURLS = this.fileURLS.map( item => item.replace("resource/","") );

        // 初始化进度条进度为0
        this._count = 0;
        this._total = this.fileURLS.length;

        // 开始加载资源
        // 每个元素加载完成调用onOnceComplete，所有加载完后调用onAllComplete
        Promise.all(this.fileURLS.map(item => RES.getResAsync(item,this.onOnceComplete,this))).then(
            () => this.onAllComplete() );
    }

    private onOnceComplete() {
        this._count ++;
        this.totalProgress.ratio = this._count / this._total;
    }

    private onAllComplete() {
        if (this.callbackFun)
        {
            setTimeout( () => this.callbackFun.call(this.callbackObj),1000);
        }
    }
}