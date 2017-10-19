class Animal extends Entity {
    protected speed: number;  // 移动速度 像素/毫秒
    protected dest: egret3d.Vector3D; // 目的坐标
    protected behavior: BehaviorTree.Node;

    constructor() {
        super();
        this.speed = 0.5; // 默认速度
        this.dest = new egret3d.Vector3D();
    }

    public getSpeed(): number {
        return this.speed;
    }

    public setSpeed(speed: number) {
        this.speed = speed;
    }

    public setBehavior(behavior: BehaviorTree.Node) {
        this.behavior = behavior;
    }

    public moveTo(dest: egret3d.Vector3D) {
        this.dest.copyFrom(dest);
        var moveBehavior = new Behavior.Move(this,dest);

        this.behavior = new BehaviorTree.Node(moveBehavior);
    }

    public update(time: number, delay: number): void {
        super.update(time,delay);
        if (this.behavior) {
            var status = this.behavior.run(time,delay);
            if (BehaviorTree.Status.Runing != status) {
                this.behavior = null;

                if (this.view) {
                    (<AnimalView>this.view).play("Idle");
                }
            }
        }
    }
}