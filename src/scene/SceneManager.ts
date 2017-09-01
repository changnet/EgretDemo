class SceneManager {
    private sceneConf: {[key:number]: any};
    private currentScene: Scene;

    constructor() {
        this.sceneConf = confManager.getHashConf("config/map_scene.json","id");
    }

    // 开始进入场景
    public enterScene(sceneID: number): void {
        if (this.currentScene) {
            throw Error("already in other scene")
        }

        var oneSceneConf = this.sceneConf[sceneID]
        if ( !oneSceneConf ) {
            throw Error(`scene config not found:${sceneID}`);
        }

        // 进入场景之前，先要加载场景资源并创建场景
        var scene = new Scene(sceneID,oneSceneConf);
        scene.loadScene(this.onLoadSceneDone,this);
        this.currentScene = scene;
    }

    // 加载场景完成
    private onLoadSceneDone():void {
        this.currentScene.createScene();
        uiManager.view.scene = this.currentScene;

        // 3d场景已创建完成。现在在3d场景上再加一层2d显示技能、之类的
        var battlePage = new BattlePage();
        uiManager.showPage(battlePage);

        // 主玩家进入场景
        var playerView = entityViewManager.createPlayerView(
                        mainPlayer.entityId,mainPlayer.modelId);
        this.currentScene.addChild(playerView);
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