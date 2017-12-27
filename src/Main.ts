
class Main extends egret.DisplayObjectContainer {
    private isThemeLoadEnd: boolean = false;
    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    async loadPreConf() {
        // 初始化Resource资源加载库，即加载default.res.json这个文件
        // 这个文件必须包含alias字段，这个字段在egret wing中编辑资源时不会自动生成
        await RES.loadConfig("resource/default.res.json","resource/"); // await 相当于协程
        
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        //加载default.thm.json这个文件及文件中包含的exmls文件
        let theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        // 加载基本的配置资源
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    public onAddToStage(){
        if (egret.Capabilities.isMobile){
            this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDE;
        }
        else{
            this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        }

        //注入自定义的素材解析器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.loadPreConf();

        uiManager = new UIManager(this);
        confManager = new ConfManager();

        // 初始化3D参数 egret3d是一个单例
        // 将舞台从2d转换为3d
        // 没初始化会导致3d组件不可用，报Cannot read property 'STATIC_DRAW' of undefined
        var stage3d = new egret3d.Stage3D(this.stage);
        egret.setRendererContext(stage3d);
        egret3d.Egret3DEngine.instance.useDevicePOLICY(0);
        egret3d.Egret3DEngine.instance.debug = false;
        egret3d.Egret3DPolicy.useAnimPoseInterpolation = true;
        egret3d.Egret3DPolicy.useAnimMixInterpolation = true;
        egret3d.Egret3DPolicy.useParticle = true;
        egret3d.Egret3DPolicy.useLowLoop = true;

        // View3D是Egre3D中的显示窗口，我们在View3D对象初始化的时候，需要填写的四个参数分别为窗口的x，y和宽高值。
        // backColor是当前显示窗口的背景颜色。需要注意的是，其中颜色值为ARGB，不要忘记前两位为Alpha信息。
        // 最后我们设置其当前View3D中摄像机的位置与朝向，并将其添加到egret3d.Egret3DCanvas对象中。
        // 加上view3D后，要把index.html中的帧率改为60以上，不然屏幕闪烁严重
        var view3d = new egret3d.View3D(0,0,stage3d.width,stage3d.height);
        stage3d.addView3D(view3d);
        sceneManager.view = view3d;

        stage3d.addEventListener(egret3d.Event3D.ENTER_FRAME,
            function (e: egret3d.Event3D) {
                    gameMain.update(e.time,e.delay);
            }, this);
    }

private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        this.isResourceLoadEnd = true;
        this.createScene();
    }
    private createScene() {
        if (!this.isThemeLoadEnd || !this.isResourceLoadEnd) {
            return;
        }

        // 加载完资源，显示login界面
        var loginPage = new LoginPage();
        uiManager.showPage(loginPage);

        // 在玩家输入帐号时，加载其他配置
        // sceneManager.initConf();
        // protobufManager.loadConf();
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
    }

    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
}
