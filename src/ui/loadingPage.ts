// 进入游戏时，资源、数据加载页面
class LoadingPage extends eui.Component{
    
    private loadProgress: eui.ProgressBar;
    private _count:number;
    private _total:number;

    constructor() {
        super();

        this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
        this.skinName = "resource/eui_exmls/LoadingPageSkin.exml";
    }

    // 加载完皮肤时调用
    private onComplete():void{
    }
}
