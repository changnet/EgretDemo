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
            Scene.monMap = confManager.getHashConf("map_monster_json","id");
            Scene.monWaveMap = confManager.getHashConf("map_wave_json","id");
        }
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
        var sceneRes = RES.getRes(`Scene${assetId}_e3dPack`);
        var s3d = sceneRes as egret3d.Scene3D;
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
        var navRes = RES.getRes(`NavGrid${assetId}_nav`);
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

        mainPlayer.setPos(pos_x,pos_z);
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