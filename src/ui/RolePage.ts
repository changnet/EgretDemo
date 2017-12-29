//  创角

class RolePage extends eui.Component {
    public nameEdit: eui.TextInput;
    public createBtn: eui.Button;

    constructor() {
        super();

        this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
        this.skinName = "resource/eui_exmls/RolePageSkin.exml";
    }

    // 加载完皮肤时调用
    private onComplete():void{
        this.createBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCreateBtnClick,this)
    }

    public onEnterPage(): void {
        srvSocket.registerCommand(SPLAYER_CREATE,this.onPlayerCreate,this);
    }

    public onLeavePage(): void {
        srvSocket.unregisterCommand(SPLAYER_CREATE);
        this.createBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onCreateBtnClick,this)
    }

    private onCreateBtnClick(e: egret.TouchEvent): void {
        this.createBtn.enabled = false;
        srvSocket.send(CPLAYER_CREATE,{ name: this.nameEdit.text });
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