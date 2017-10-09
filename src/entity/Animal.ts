class Animal extends Entity {
    private dest: egret3d.Vector3D;
    protected behavior: BehaviorTree.Node;

    constructor() {
        super();
        this.dest = new egret3d.Vector3D();
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
        if (this.behavior) {
            var status = this.behavior.run(time,delay);
            if (BehaviorTree.Status.Runing != status) {
                this.behavior = null;
            }
        }
    }
}