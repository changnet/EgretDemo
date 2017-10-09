class Entity {
    private _entityId: number;
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

    public setPos(x: number,z: number):void {
        this.pos.x = x;
        this.pos.z = z;
    }
}