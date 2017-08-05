class ConfEvent extends egret.Event {
    public static CONF_LOADED: string = "conf_loaded";

    public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false)
    {
        super(type,bubbles,cancelable);
    }
}

class ConfManager extends egret.EventDispatcher {

    private confMap: {[key:string]:any} = {};
    private initFunc: {[key:string]:Function} = {};
    private loadingPage: LoadingPage;

    // 异步加载资源
    private static resource = [
            "ShadowPlane.png",
            "config/equip_weapon.json",
            "config/map_scene.json",
            "config/map_wave.json",
            "config/map_monster.json",
            "config/player_hero.json"
        ];
    
    constructor() {
        super();
    }

    async preloadRes(){
        // 上面加载完loading界面所需要的资源后，显示loading界面并加载游戏的其他资源
        this.loadingPage = new LoadingPage(ConfManager.resource.length);
        uiManager.showPage(this.loadingPage);

        this.startLoad();
    }

    public setInitFunc(name: string,func: Function) {
        if (name in this.initFunc) {
            throw new Error(`init function for ${name} already exist`);
        }

        this.initFunc[name] = func;
    }

    // 设置配置文件，如果设置了初始化函数，先初始化
    private setConf(name: string,conf: any) {
        if (name in this.confMap) {
            return this.confMap[name]
        }

        var conf = RES.getRes(name);
        if (name in this.initFunc) {
            var func: Function = this.initFunc[name];
            conf = func.call(name);
        }
        this.confMap[name] = conf;

        return conf;
    }

    // 把数组类型的配置以指定字段为key转换为hash并返回
    public getHashConf(name: string,key: string) {
        var hashConf = {}

        var rawConf = this.getConf(name);
        for ( let one of rawConf ) {
            hashConf[one[key]] = one
        }

        return hashConf
    }

    public getConf(name: string) {
        return this.confMap[name]
    }

    private startLoad() {

        // 把resource里的每个元素中的resource/替换为空串
        var urls = ConfManager.resource.map( item => item.replace("resource/","") );

        // 开始加载资源
        // 每个元素加载完成调用onOnceComplete，所有加载完后调用onAllComplete
        Promise.all(urls.map(item => RES.getResAsync(item,this.onOnceComplete,this))).then(
            () => this.onAllComplete() );
    }

    private onOnceComplete(val:any,key: string) {
        this.setConf(key,val);
        this.loadingPage.update();
    }

    private onAllComplete() {
        var confEv = new ConfEvent(ConfEvent.CONF_LOADED);
        var success = this.dispatchEvent(confEv);
    }

}

let confManager: ConfManager;