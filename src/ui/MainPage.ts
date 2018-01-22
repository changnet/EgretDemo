//  创角

class MainPage extends eui.Component {
    public sceneNameImg: eui.TextInput;
    public mapBtn: eui.Button;

    constructor() {
        super();

        this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
        this.skinName = "resource/eui_exmls/MainPageSkin.exml";
    }

    // 加载完皮肤时调用
    private onComplete():void{
        this.mapBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMapBtnClick,this)
    }

    public onEnterPage(): void {
        srvSocket.registerCommand(SPLAYER_CREATE,this.onPlayerCreate,this);
    }

    public onLeavePage(): void {
        srvSocket.unregisterCommand(SPLAYER_CREATE);
        this.mapBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMapBtnClick,this)
    }

    private onMapBtnClick(e: egret.TouchEvent): void {
        this.mapBtn.enabled = false;
    }

    private onPlayerCreate(ecode: number,pkt: any): void {
        if (0 != ecode) {
            console.log(`create role error:${ecode}`);
            return;
        }

        var loadingPage = new LoadingPage();
        uiManager.showPage(loadingPage);
    }

}