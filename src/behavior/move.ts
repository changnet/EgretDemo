//  移动逻辑处理

namespace Behavior {
    export class Move {
        private entity: Animal;  // 需要移动的实体
        private dest: egret3d.Vector3D; // 目标坐标

        private index: number; // 路线点索引
        private pathPoint: egret3d.Vector3D[]; // 路线点

        constructor(entity: Animal,dest: egret3d.Vector3D) {
            this.dest = dest;
            this.entity = entity;
        }

        public run(time: number,delay: number): BehaviorTree.Status {
            console.log("walking ...")
            return BehaviorTree.Status.Runing;
        }
    }
}