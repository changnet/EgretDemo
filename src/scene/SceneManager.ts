class SceneManager {
    private sceneConf: {[key:number]: any};

    constructor() {
        this.sceneConf = confManager.getHashConf("conf/map_scene.json","id");
        console.log(this.sceneConf)
    }

    public enterScene(sceneID: number): void {
        var oneSceneConf = this.sceneConf[sceneID]
        if ( !oneSceneConf ) {
            throw Error(`scene config not found:${sceneID}`);
        }

        var assertId: number = oneSceneConf["assert_id"]
        var resUrl: string[] = []

        // 场景资源
        // e3dpack是unity3d的格式，需要使用unity3d的工具来编辑和导出
        // http://developer.egret.com/cn/github/egret-docs/Engine3D/unity/5/index.html
        resUrl.push(`scene/${assertId}/Scene.e3dPack`)
        resUrl.push(`scene/${assertId}/NavGrid.nav`)
    }
}

let sceneManager: SceneManager;