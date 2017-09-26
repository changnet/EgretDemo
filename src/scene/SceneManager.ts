
// 相机视角控制
class CameraCtrl {
        private _camera: egret3d.Camera3D;
        private _target: egret3d.Object3D;

        private _height: number = 400; 
        private _tiltAngle: number = 60;
        private _offsetZ: number = 0;
        constructor() {
            this.height = 1000 ;
            this.tiltAngle = 50;
        }

        public set camera(camera: egret3d.Camera3D) {
            this._camera = camera;
        }

        public set target(newTarget: egret3d.Object3D) {
            this._target = newTarget;
        }

        public set height(v: number) {
            this._height = v;
            this.notifeUpdate();
        }

        public set tiltAngle(v: number) {
            this._tiltAngle = v;
            this.notifeUpdate();
        }

        public update(time: number, delay: number) {
            if (this._target) {
                this._camera.rotationX = this._tiltAngle; 
                this._camera.x = this._target.x;
                this._camera.y = this._target.y + this._height ;
                this._camera.z = this._target.z - this._offsetZ;
            }
        }

        private notifeUpdate() {
            this._offsetZ = this._height / Math.tan(
                this._tiltAngle*egret3d.MathUtil.DEGREES_TO_RADIANS);
        }
}

class SceneManager {
    private sceneConf: {[key:number]: any};
    private currentScene: Scene;

    private _view:egret3d.View3D;
    private cameraCtrl: CameraCtrl;

    constructor() {
        this.cameraCtrl = new CameraCtrl();
    }

    public initConf() {
        this.sceneConf = confManager.getHashConf("config/map_scene.json","id");
    }

    public set view(vw: egret3d.View3D) {
        this._view = vw;
        this.cameraCtrl.camera = vw.camera3D;
    }

    public get view(): egret3d.View3D {
        return this._view;
    }

    public lookAt(target: egret3d.Object3D): void {
        this.cameraCtrl.target = target;
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
        this.view.scene = this.currentScene;

        // 3d场景已创建完成。现在在3d场景上再加一层2d显示技能、之类的
        var battlePage = new BattlePage();
        uiManager.showPage(battlePage);

        // 主玩家进入场景
        this.currentScene.addMainPlayer(mainPlayer);
    }

    // 帧更新
    public update(time: number, delay: number) {
        if (this.currentScene) {
            // 更新摄像机视角
            this.cameraCtrl.update(time,delay);

        }
    }
}

let sceneManager: SceneManager = new SceneManager();