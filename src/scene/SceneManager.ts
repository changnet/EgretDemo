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
}

let sceneManager: SceneManager;