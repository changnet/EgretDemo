// 玩家显示相关类
class PlayerView extends AnimalView {
    private static heroConf: {[key:number]: any};

    constructor(entityId: number,modelId: number) {
        super(entityId);

        if (!PlayerView.heroConf) {
            PlayerView.heroConf = 
                confManager.getHashConf("config/player_hero.json","id");
        }

        var conf = PlayerView.heroConf[modelId]
        if (!conf) {
            throw Error(`player hero config not found:${modelId}`)
        }

        var assertId = conf["asset_id"];
        var rawRole: egret3d.Role = RES.getRes(`anim/${assertId}.e3dPack`);
        var role = rawRole ? rawRole.clone() : null;

        if (role) {
            this.addChild(role);
        }
    }
}