// 玩家显示相关类
class PlayerView extends AnimalView {
    private static heroConf: {[key:number]: any};

    constructor(entityId: number,modelId: number) {
        super(entityId);

        if (!PlayerView.heroConf) {
            PlayerView.heroConf = 
                confManager.getHashConf("player_hero_json","id");
        }

        var conf = PlayerView.heroConf[modelId]
        if (!conf) {
            throw Error(`player hero config not found:${modelId}`)
        }

        // 创建一个egret3d用于显示的对象
        var assertId = conf["asset_id"];
        this.createRole(`${assertId}_e3dPack`);
    }
}