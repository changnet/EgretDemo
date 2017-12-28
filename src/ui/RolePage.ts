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

    private onCreateBtnClick(e: egret.TouchEvent): void {

    }
}