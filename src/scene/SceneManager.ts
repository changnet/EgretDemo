class SceneManager {
    private sceneConf: {[key:number]: any};
    private currentScene: Scene;

    constructor() {
        this.sceneConf = confManager.getHashConf("config/map_scene.json","id");
    }

    public enterScene(sceneID: number): void {
        if (this.currentScene) {
            throw Error("already in other scene")
        }

        var oneSceneConf = this.sceneConf[sceneID]
        if ( !oneSceneConf ) {
            throw Error(`scene config not found:${sceneID}`);
        }

        var scene = new Scene(sceneID,oneSceneConf);
        scene.loadScene(this.onLoadSceneDone,this);
        this.currentScene = scene;
    }

    private onLoadSceneDone():void {
        this.currentScene.createScene();
        uiManager.view.scene = this.currentScene;

        var battlePage = new BattlePage();
        uiManager.showPage(battlePage);
    }

    // 帧更新
    public update(time: number, delay: number) {
        if (this.currentScene) {
            // 更新摄像机视角
            uiManager.view.camera3D.lookAt(
                new egret3d.Vector3D(3000, 1500, 1819),
                new egret3d.Vector3D(2628, 9, 1819));
        }
    }
}

let sceneManager: SceneManager;