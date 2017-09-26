// 动物基类(包括怪物、玩家等可以移动，会攻击其他实体的对象)
class AnimalView extends EntityView {
    private role: egret3d.Role;

    constructor(entityId: number) {
        super(entityId);
    }

    public createRole(url :string) {
        var rawRole: egret3d.Role = RES.getRes(url);
        var role = rawRole ? rawRole.clone() : null;
        if (role) {
            this.role = role;
            this.addChild(role);
        }
        else {
            console.error(`AnimalView createRole error:${url}`)
        }
    }

    // 播放动画
    public play(animName?: string, speed?: number, 
        reset?: boolean, prewarm?: boolean): boolean {
        if (!this.role) return false;

        return this.role.skeletonAnimation.play(animName,speed,reset,prewarm);
    }
}