class LoginPage extends eui.Component {
    public loginBtn: eui.Button;
    public hostEdit: eui.TextInput;
    public portEdit: eui.TextInput;
    public accEdit : eui.TextInput;

    constructor() {
        super();

        this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
        this.skinName = "resource/eui_exmls/LoginPageSkin.exml";
    }

    // 覆盖基类，在创建控件时调用
    protected createChildren() {
        super.createChildren();
    }

    // 覆盖基类，在控件创建完成时调用
    protected childrenCreated() {
        super.childrenCreated();
    }
    // 加载完皮肤时调用
    private onComplete():void{
        // 注意：在createChildren和childrenCreated中，如果没有预先加载exml文件，是不会创建控件
        // 要等eui.UIEvent.COMPLETE事件才会创建控件
        // 控件匹配规则是根据名字：http://edn.egret.com/cn/docs/page/509
        this.loginBtn.touchEnabled = true;
        this.loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);
    }

    private onButtonClick(e: egret.TouchEvent): void {
        // var roomPage = new RoomPage();
        // uiManager.showPage(roomPage);

        var LOGIN_KEY = "409065b7570155637b95e38ca13542e0";
        var sign = CryptoJS.MD5(LOGIN_KEY + "2" + "bbb").toString();
        console.log( "md5 result", sign );
        srvSocket.send(CPLAYER_LOGIN,{sid:1,time:2,plat:999,sign:sign,account:"bbb"});
    }

    public onLeavePage():void {
        this.loginBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);
    }
}