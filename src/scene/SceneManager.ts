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
        scene.loadScene();
        this.currentScene = scene;
    }
}

let sceneManager: SceneManager;