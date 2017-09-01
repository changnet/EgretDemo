// 玩家对象数据类
class Player extends Animal {
    private _pid: number; // player id,玩家唯一id
    private _modelId: number; // 模型id，对应player_hero配置表

    constructor(entityId: number,pid: number) {
        super();

        this._pid = pid
        this.entityId = entityId;
    }

    get pid() {
        return this._pid;
    }

    get modelId(): number {
        return this._modelId;
    }

    set modelId(modelId: number) {
        this._modelId = modelId;
    }
}

let mainPlayer:Player; // 主玩家对象