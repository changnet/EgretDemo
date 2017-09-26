class Animal extends Entity {
    protected pos: egret3d.Vector3D = new egret3d.Vector3D(); // 当前位置

    setPos(x: number,z: number):void {
        this.pos.x = x;
        this.pos.z = z;
    }
}