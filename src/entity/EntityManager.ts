///<reference path="Player.ts" />
class EntityManager {
    private entityIdSeed: number;
    private entityMap: {[key:number]: Entity} = {}

    constructor() {
        this.entityIdSeed = 0;
    }

    // TODO:创建一个全局唯一的实体id，这个功能由服务器完成
    private newEntityId(): number {
        return ++this.entityIdSeed;
    }

    // 创建一个玩家对象
    public createNewPlayer( pid: number ) {
        var entityId = this.newEntityId()
        var player = new Player(entityId,pid);

        this.entityMap[entityId] = player;

        return player;
    }
}

let entityManager: EntityManager = new EntityManager();