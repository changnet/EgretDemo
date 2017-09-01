class Entity {
    private _entityId: number;

    constructor() {
        this._entityId = 0;
    }

    set entityId(entityId: number) {
        this._entityId = entityId;
    }

    get entityId(): number {
        return this._entityId;
    }
}