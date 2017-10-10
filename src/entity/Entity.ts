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
    protected pos: egret3d.Vector3D = new egret3d.Vector3D(); // 当前位置

    constructor() {
        this._entityId = 0;
    }

    set entityId(entityId: number) {
        this._entityId = entityId;
    }

    get entityId(): number {
        return this._entityId;
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
}