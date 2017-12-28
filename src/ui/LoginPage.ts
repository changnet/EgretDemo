class LoginPage extends eui.Component {
    public loginBtn: eui.Button;
    public hostEdit: eui.TextInput;
    public portEdit: eui.TextInput;
    public accEdit : eui.TextInput;

    private protoComplete: boolean = false;
    private confComplete: boolean = false;
    public progressLabel: eui.Label;

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

        // 用户输入的时候，后台加载
        resLoader.loadGroup("initload",this,this.onConfComplete,this.onConfProgress);
    }

    private onButtonClick(e: egret.TouchEvent): void {
        if (!this.hostEdit || !this.portEdit) {
            throw `component not found`;
        }

        this.loginBtn.enabled = false; // 防止重复点击
        srvSocket.connect(this.hostEdit.text,parseInt(this.portEdit.text));
    }

    public onEnterPage(): void {
        // TODO: 暂时没法控制proto文件的加载，先放这，后面再仔细看看
        protobufManager.loadConf( () => this.onProtoComplete() );
        srvSocket.registerStatus(this.onConnect,this);
        srvSocket.registerCommand(SPLAYER_LOGIN,this.onPlayerLogin,this);
    }

    public onLeavePage(): void {
        srvSocket.unregisterStatus();
        srvSocket.unregisterCommand(SPLAYER_LOGIN);
        this.loginBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);
    }

    private onProtoComplete() {
        this.protoComplete = true;
        this.doLogin();
    }

    // 资源回加载完成，尝试登录
    private onConfComplete(success: boolean): void {
        this.confComplete = true;

        this.doLogin();
    }

    // 资源加载进度
    private onConfProgress(loadCnt: number,total: number) {
        var percent: number = Math.ceil(loadCnt/total)*100;
        this.progressLabel.text = `loading...${percent}%`;
    }

    // socket连接结果
    private onConnect() {
        if (!srvSocket.valid()) {
            return;
        }

        this.doLogin();
    }

    // 登录逻辑
    private doLogin() {
        if ( !srvSocket.valid() || !this.confComplete || !this.protoComplete ){
            return;
        }

        var LOGIN_KEY = "409065b7570155637b95e38ca13542e0";
        var pkt = 
        {
            sid:1, // server id
            time: Math.floor(new Date().getTime()/1000),
            plat: 999, // test platform
            account: this.accEdit.text,
        }
        pkt["sign"] = CryptoJS.MD5(LOGIN_KEY + pkt.time + pkt.account).toString();
        console.log( "login", pkt );
        srvSocket.send(CPLAYER_LOGIN,pkt);
    }

    private onPlayerLogin(ecode,pkt): void {
        if (!pkt.pid || 0 == pkt.pid) {
            var rolePage = new RolePage()
            uiManager.showPage(rolePage)
        }
        else {
            // 直接进入loading界面
        }
    }
}