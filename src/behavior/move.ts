//  移动逻辑处理

namespace Behavior {
    export class Move extends Base {
        private entity: Animal;  // 需要移动的实体
        private dest: egret3d.Vector3D; // 目标坐标

        private index: number; // 路线点索引
        private pathPoint: egret3d.Vector3D[]; // 路线点

        private direction: egret3d.Vector3D; // 移动方向，即x、y、z的变动值

        constructor(entity: Animal,dest: egret3d.Vector3D) {
            super();
            this.dest = dest;
            this.entity = entity;
        }

        public onEnter(): void {
            // 初始化移动路径
            this.pathPoint = []
            var scene = sceneManager.getCurrentScene();
            var naviGrid = scene.getNaviGrid();
            naviGrid.findPath(this.entity.getPos(),this.dest,this.pathPoint);

            // 播放移动动画
            var view = this.entity.getView()
            if (view) {
                (<AnimalView>view).play("Run");
            }

            this.direction = new egret3d.Vector3D();
            this.moveNextStep(this.entity.getPos(),this.dest)
        }

        // 移动一步
        private moveNextStep(src: egret3d.Vector3D,dest: egret3d.Vector3D) {
            // 目的坐标减去起点坐标，结果存在this.direction
            this.dest.subtract(src,this.direction)

            // 把相对值三维坐标转转为绝对坐标(参考点为{0,0,0})
            this.direction.normalize();

            this.entity.trunDirection(this.direction.x,this.direction.z);
        }

        public run(time: number,delay: number): BehaviorTree.Status {
            return BehaviorTree.Status.Runing;
        }
    }
}