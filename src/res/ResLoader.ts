class ResGroup {
    public name: string;
    public thisObj: any;
    public progress: Function;
    public complete: Function;
}

// 自定义资源加载
class ResLoader {
    private groupMap: {[key:string]: ResGroup} = {}

    constructor() {
        // RES.registerAnalyzer("e3dpack", RES.UnitAnalyzer);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
    }

    public init() {
        // 初始化Resource资源加载库，即加载default.res.json这个文件
        // 这个文件必须包含alias字段，这个字段在egret wing中编辑资源时不会自动生成
        RES.loadConfig("resource/default.res.json","resource/");
        RES.registerAnalyzer("e3dpack", RES.UnitAnalyzer);
    }

    // wrap一层RES.loadGroup，简化回调，允许不同分组不同回调函数,并且不用取消事件监听
    public loadGroup(name: string,thisObj: any,complete: Function,progress?: Function): void {
        var resGroup = new ResGroup()
        resGroup.name = name;
        resGroup.thisObj = thisObj;
        resGroup.complete = complete;
        resGroup.progress = progress;

        this.groupMap[name] = resGroup;
        RES.loadGroup(name);
    }

    // wrap一层RES.loadGroup，简化回调，允许不同分组不同回调函数,并且不用取消事件监听
    public loadMultiGroup(name: string,groupList: string[],thisObj: any,complete: Function,progress?: Function): void {
        RES.createGroup(name,groupList);
        this.loadGroup(name,thisObj,complete,progress);
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        var resGroup = this.groupMap[event.groupName]
        // 可能是其他地方调用了原生的RES加载
        if (!resGroup) {
            return;
        }

        this.groupMap[event.groupName] = undefined;
        resGroup.complete.call(resGroup.thisObj,true);
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
        var resGroup = this.groupMap[event.groupName]
        // 可能是其他地方调用了原生的RES加载
        if (!resGroup) {
            return;
        }

        this.groupMap[event.groupName] = undefined;
        resGroup.complete.call(resGroup.thisObj,false);
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        var resGroup = this.groupMap[event.groupName]
        // 可能是其他地方调用了原生的RES加载
        if (!resGroup) {
            return;
        }

        this.groupMap[event.groupName] = undefined;
        resGroup.complete.call(resGroup.thisObj,false);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        var resGroup = this.groupMap[event.groupName]
        // 可能是其他地方调用了原生的RES加载
        if (!resGroup) {
            return;
        }

        if (!resGroup.progress) {
            return;
        }

        resGroup.progress.call(resGroup.thisObj,event.itemsLoaded, event.itemsTotal);
    }
}

let resLoader = new ResLoader();
