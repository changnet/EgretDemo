// 进入游戏时，资源、数据加载页面
class LoadingPage extends eui.Component{
    
    private loadProgress: eui.ProgressBar;

    // 服务器和客户端已加载的数据、资源
    private srvLoad: number;
    private cltLoad: number;

    // 服务器和客户端需要加载的总数据、资源
    private srvTotal: number;
    private cltTotal: number;

    private srvReady: boolean = false;
    private cltReady: boolean = false;

    constructor() {
        super();

        this.srvLoad = 0;
        this.cltLoad = 0;
        this.cltTotal = 1; // 这个初始不为0即可，RES没有函数获取分组资源数量，后面再覆盖
        this.srvTotal = 1; // 这个后期根据游戏实际情况估计一下就可以了，不需要精准

        this.addEventListener(eui.UIEvent.COMPLETE,this.onComplete,this);
        this.skinName = "resource/eui_exmls/LoadingPageSkin.exml";
    }

    // 加载完皮肤时调用
    private onComplete():void{
        this.updateProgress();
    }

    // 更新进度
    private updateProgress(): void {
        // 皮肤可能还没加载完
        if (!this.loadProgress) {
            return;
        }

        // 服务端、客户端加载各占50%进度
        // 服务端考虑加个监听到srvSocket，每来个指令就回调一下
        this.loadProgress.value = this.srvLoad*50/this.srvTotal + this.cltLoad*50/this.cltTotal;
    }

    public onEnterPage(): void {
        srvSocket.registerCommand(SPLAYER_ENTER,this.onPlayerEnter,this);

        srvSocket.send(CPLAYER_ENTER,{});
        resLoader.loadMultiGroup("playerenterload",["enterload","scene100001"],this,this.onResComplete,this.onResProgress);
    }

    public onLeavePage(): void {
        srvSocket.unregisterCommand(SPLAYER_ENTER);
    }

    private onResProgress(loadCnt: number,total: number): void {
        this.cltLoad = loadCnt;
        this.cltTotal = total;
        this.updateProgress();
    }

    private onResComplete(): void {
        this.cltReady = true;
        console.log("client player enter world");

        this.enterWorld();
    }

    private onPlayerEnter(ecode: number,pkt: any): void {
        this.srvLoad = this.srvTotal;
        console.log("server player enter world");

        this.updateProgress();

        this.srvReady = true;
        this.enterWorld();
    }

    private enterWorld(): void {
        // 不要用资源加载数量对比，因为服务器的协议数量不准
        if ( !this.srvReady || !this.cltReady ) {
            return;
        }
        // 进入游戏主场景
        var mainPage = new MainPage();
        uiManager.showPage( mainPage );

        sceneManager.initConf();
        sceneManager.enterScene( 100000 );
    }
}
