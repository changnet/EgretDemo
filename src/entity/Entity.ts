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
    protected view: EntityView; // 该实体对应的显示对象
    protected pos: egret3d.Vector3D = new egret3d.Vector3D(); // 当前位置

    protected angle: number;     // 需要转向的角度
    protected currAngle: number; // 当前的角度
    private direction: number;   // 转动方向，-1是往二、三象限([0,-180])
    static angleSpeed: number = 90/1000; // 转向速度 角度/毫秒

    constructor() {
        this._entityId = 0;
        this.angle = 0;
        this.currAngle = 0;
    }

    set entityId(entityId: number) {
        this._entityId = entityId;
    }

    get entityId(): number {
        return this._entityId;
    }

    // 帧更新
    public update(time: number,delay: number) {
        if (this.view) {
            // 更新方向
            this.updateDirection(time,delay);

            // 更新位置
            if (!this.pos.equal(this.view.position)) {
                this.view.position = this.pos
            }
        }
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
        // 以y轴旋转时，剩下的x、z轴形成一个平面
        // atan2(x,y)：返回-PI 到 PI 之间的值，是从 X 轴正向逆时针旋转到点 (x,y) 
        // 时经过的弧度,乘以RADIANS_TO_DEGREES得到角度
        // 这里Math.atan2(x, z)是从x轴转向z轴
        this.angle = 
            Math.atan2(x, z) * egret3d.MathUtil.RADIANS_TO_DEGREES;

        // this.angle这时的范围是[-180,180]
        // 计算需要转动的角度
        var deltaAngle = this.angle - this.currAngle
        // 转动方向，-1往左转[0,-180]，1往右转[0,180]
        this.direction = deltaAngle > 0 ? 1 : -1;
    }

    // 每帧更新转向,rotationY各个方向如下(三、四象限有正负两个数值，效果一样)：
    //              0
    //              | 
    // 270(-90) ----|---- 90
    //              |
    //           180(-180)
    private updateDirection(time: number,delay: number) {
        if (this.currAngle == this.angle) return; // 不需要转向

        // delay 是当前帧经过的毫秒，计算出当次要转动的角度
        this.currAngle += this.direction * delay * Entity.angleSpeed;

        // 左转右转都不要转过头了
        if ( (this.direction > 0 && this.currAngle > this.angle ) ||
            (this.direction < 0 && this.currAngle < this.angle ) ){
            this.currAngle = this.angle
        }

        // 转向，就是按y轴转动
        this.view.rotationY = this.currAngle;
    }
}