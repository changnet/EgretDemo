// 实体的一些状态
enum EntityState {
    esIdle   = 1,  // 待机状态
    esMove   = 2,  // 正常移动
    esRun    = 3,  // 跑动
    esJump   = 4,  // 跳跃
    esFly    = 5,  // 飞行
    esGather = 6,  // 采集

    esMax  
}

class Entity {
    private _entityId: number;
    private state: number[];
    private view: EntityView; // 该实体对应的显示对象
    protected pos: egret3d.Vector3D = new egret3d.Vector3D(); // 当前位置

    protected angle: number;     // 需要转向的角度
    protected currAngle: number; // 当前的角度
    protected angleSpeed: number; // 转向速度

    constructor() {
        this._entityId = 0;
    }

    set entityId(entityId: number) {
        this._entityId = entityId;
    }

    get entityId(): number {
        return this._entityId;
    }

    // 帧更新
    public update(time: number,delay: number) {

    }

    // 设置当前位置，普通移动通常只设置两个坐标
    public setPos(x: number,z: number):void {
        this.pos.x = x;
        this.pos.z = z;
    }

    // 获取当前位置
    public getPos() {
        return this.pos;
    }

    // 设置view
    public setView(view: EntityView) {
        this.view = view;
    }

    // 获取view
    public getView(): EntityView {
        return this.view;
    }

    // 设置转向
    // @x @z 是三维坐标中的x z
    public trunDirection(x: number,z: number) {
        // this.angle = EMathEx.normalizeAngle(Math.atan2(x, z) * egret3d.MathUtil.RADIANS_TO_DEGREES);
        // this.currAngle = this.angle;
        // this._rotNeedTime = this.rotTime;
    }
}