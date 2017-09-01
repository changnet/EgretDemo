// 动物基类(包括怪物、玩家等可以移动，会攻击其他实体的对象)
class AnimalView extends EntityView {

    constructor(entityId: number) {
        super(entityId);
    }
}