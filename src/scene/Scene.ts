class Scene extends egret3d.Scene3D {
    private sceneID: number;
    private sceneConf: any;
    private static monMap: {[key: number]: any};
    private static monWaveMap: {[key: number]: any};
    private loadingPage: LoadingPage;

    private terrainMesh: egret3d.Mesh;
    private naviGrid: egret3d.NavGrid;

    constructor(id: number,sceneConf: any) {
        super();

        this.sceneID = id;
        this.sceneConf = sceneConf;

        if (!Scene.monMap || !Scene.monWaveMap) {
            Scene.monMap = confManager.getHashConf("config/map_monster.json","id");
            Scene.monWaveMap = confManager.getHashConf("config/map_wave.json","id");
        }
    }

    public loadScene(callBack: Function,callBackObj: any) {
        var assetId: number = this.sceneConf["asset_id"];
        var resUrl: string[] = [];

        // 场景资源
        // e3dpack是unity3d的格式，需要使用unity3d的工具来编辑和导出
        // http://developer.egret.com/cn/github/egret-docs/Engine3D/unity/5/index.html
        resUrl.push(`scene/${assetId}/Scene.e3dPack`);
        resUrl.push(`scene/${assetId}/NavGrid.nav`);

        // 怪物资源
        var monIdMap: {[key: number]: boolean} = {} //防止重复加载
        var resKeyMap: {[key: string]: boolean} = {}
        var monWave: number = this.sceneConf["monster_wave"];
        while (monWave) {
            let waveConf = Scene.monWaveMap[monWave];
            if (!waveConf) {
                throw Error(`monster wave config not found in scene(${this.sceneID}) wave(${monWave})`);
            }

            for (let monId of waveConf["monster_id"]) {
                if (monIdMap[monId]) {
                    continue;
                }

                monIdMap[monId] = true;
                let monConf = Scene.monMap[monId];
                if (!monConf) {
                    throw Error(`monster config not found in scene(${this.sceneID}) wave(${monWave}) mon(${monId})`);
                }
                // 怪物动作
                let monAsset = monConf["asset_id"];
                if (resKeyMap[monAsset]) {
                    continue;
                }

                resKeyMap[monAsset] = true;
                resUrl.push(`anim/${monAsset}.e3dPack`);
                // 怪物技能
            }

            monWave = waveConf["next_wave"];
        }

        // 异步加载资源
        // 这些资源url都没有加resource前缀，因为在RES.processor.map调用加载函数的时候，会加上前缀
        this.loadingPage = new LoadingPage(resUrl.length);
        uiManager.showPage(this.loadingPage);

        Promise.all(resUrl.map(item => RES.getResAsync(item,this.onOnceComplete,this))).then(
            () => setTimeout( () => callBack.call(callBackObj),100 )
        );
    }

    private onOnceComplete(val: any,key: string) {
        this.loadingPage.update();
    }

    private addFog(obj: egret3d.Object3D,how: egret3d.LineFogMethod) {
        for (var child of obj.childs) {
            // 如果类型是Mesh，则指定雾化方式，渲染的时候会自动生效
            if (child instanceof egret3d.Mesh) {
                (<egret3d.Mesh>child).material.diffusePass.addMethod(how);
            }
            else {
                // 如果还包含子物件，则递归雾化
                this.addFog(child,how);
            }
        }
    }

    public createScene():void {
        // 添加场景资源
        var assetId: number = this.sceneConf["asset_id"];
        var sceneRes = RES.getRes(`scene/${assetId}/Scene.e3dPack`)
        this.addChild(sceneRes);

        // 添加特效
        // 创建雾化方式
        var lfm: egret3d.LineFogMethod = new egret3d.LineFogMethod();
        lfm.fogFarDistance = 1400;
        lfm.fogStartDistance = 3000;
        lfm.fogColor = egret3d.Color.RGBAToColor(0.0,192.0/255.0,1.0,1.0);
        lfm.fogAlpha = 1.0
        // 把当前场景用指定的方式雾化
        this.addFog(this,lfm);

        // 创建地形导航网格
        var navRes = RES.getRes(`scene/${assetId}/NavGrid.nav`);
        this.naviGrid = egret3d.NavGrid.createNavGridFromBuffer(navRes);
        var terrain: egret3d.Mesh =
            <egret3d.Mesh>sceneRes.findObject3D("TerrainCollider");
        if (terrain) {
            terrain.pickType = egret3d.PickType.PositionPick;
            terrain.enablePick = true; //设定这个物件是否具有 鼠标交互能力的开关
            this.terrainMesh = terrain;
            terrain.addEventListener(
                egret3d.PickEvent3D.PICK_UP, this.terrainPick, this);
        }
    }

    // 主角进入场景
    public addMainPlayer(mainPlayer:Player) {
        var playerView = entityViewManager.createPlayerView(
                    mainPlayer.entityId,mainPlayer.modelId);
        this.addChild(playerView);

        playerView.play("Idle");

        // TODO: MVC写法是不应该绑定的
        mainPlayer.setView(playerView);

        var pos_x = this.sceneConf["pos_x"];
        var pos_y = this.sceneConf["pos_y"];
        var pos_z = this.sceneConf["pos_z"];

        playerView.x = pos_x;
        playerView.z = pos_z;
        sceneManager.lookAt(playerView);
    }

    // 获取当前场景的导航数据
    public getNaviGrid() {
        return this.naviGrid;
    }

    // 地图鼠标点击事件
    private terrainPick(e: egret3d.PickEvent3D) {
        // 处理主角移动
        mainPlayer.moveTo(e.pickResult.globalPosition);
    }

}