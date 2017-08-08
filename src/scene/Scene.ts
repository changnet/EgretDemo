class Scene {
    private sceneID: number;
    private sceneConf: any;
    private static monMap: {[key: number]: any};
    private static monWaveMap: {[key: number]: any};
    private loadingPage: LoadingPage;

    constructor(id: number,sceneConf: any) {
        this.sceneID = id;
        this.sceneConf = sceneConf;

        Scene.monMap = confManager.getHashConf("config/map_monster.json","id");
        Scene.monWaveMap = confManager.getHashConf("config/map_wave.json","id");
    }

    public loadScene() {
        var assetId: number = this.sceneConf["asset_id"];
        var resUrl: string[] = [];

        // 场景资源
        // e3dpack是unity3d的格式，需要使用unity3d的工具来编辑和导出
        // http://developer.egret.com/cn/github/egret-docs/Engine3D/unity/5/index.html
        resUrl.push(`scene/${assetId}/Scene.e3dPack`);
        //resUrl.push(`scene/${assetId}/NavGrid.nav`);

        // 怪物资源
        var monWave: number = this.sceneConf["monster_wave"];
        while (monWave) {
            let waveConf = Scene.monWaveMap[monWave];
            if (!waveConf) {
                throw Error(`monster wave config not found in scene(${this.sceneID}) wave(${monWave})`);
            }

            for (let monId of waveConf["monster_id"]) {
                let monConf = Scene.monMap[monId];
                if (!monConf) {
                    throw Error(`monster config not found in scene(${this.sceneID}) wave(${monWave}) mon(${monId})`);
                }
                // 怪物动作
                let monAsset = monConf["asset_id"];
                resUrl.push(`anim/${monAsset}.e3dPack`);
                // 怪物技能
            }

            monWave = waveConf["next_wave"];
        }

        // 异步加载资源
        this.loadingPage = new LoadingPage(resUrl.length);
        uiManager.showPage(this.loadingPage);

        Promise.all(resUrl.map(item => RES.getResAsync(item,this.onOnceComplete,this))).then(
            () => this.onAllComplete()
        );
    }

    private onOnceComplete(val: any,key: string) {
        console.log(key)
        this.loadingPage.update();
    }

    private onAllComplete() {
        console.log("scene asset load complete")
    }

    // 场景初始化在sceneManager.enterScene
    // 主角初始化在logicManager.startGameRoom
    // 塔和怪物也是通过addRole添加到场景
}