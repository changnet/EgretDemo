//  移动逻辑处理

namespace Behavior {
    export class Move extends Base {
        private entity: Animal;  // 需要移动的实体
        private dest: egret3d.Vector3D; // 目标坐标

        private index: number; // 路线点索引
        private pathPoint: egret3d.Vector3D[]; // 路线点

        private interval: number; // 移动一个步骤所需要时间，毫秒
        private direction: egret3d.Vector3D; // 移动方向，即x、y、z的变动值

        constructor(entity: Animal,dest: egret3d.Vector3D) {
            super();
            this.dest = dest;
            this.interval = 0;
            this.entity = entity;
        }

        public onEnter(): void {
            // 初始化移动路径
            this.index = 0;
            this.pathPoint = [];
            var scene = sceneManager.getCurrentScene();
            var naviGrid = scene.getNaviGrid();
            naviGrid.findPath(this.entity.getPos(),this.dest,this.pathPoint);

            // 播放移动动画
            var view = this.entity.getView();
            if (view) {
                (<AnimalView>view).play("Run");
            }

            this.direction = new egret3d.Vector3D();
            this.moveNextStep(this.entity.getPos(),this.pathPoint[this.index])
        }

        // 移动一步
        private moveNextStep(src: egret3d.Vector3D,dest: egret3d.Vector3D) {
            // 计算所需要时间
            this.interval = 
                egret3d.Vector3D.distance(src,dest)/this.entity.getSpeed();

            // 目的坐标减去起点坐标，得到一个向量值，存在this.direction
            this.dest.subtract(src,this.direction)

            // 转化为单位向量
            this.direction.normalize();

            // 通过x z轴计算旋转方向
            this.entity.trunDirection(this.direction.x,this.direction.z);
        }

        public run(time: number,delay: number): BehaviorTree.Status {
            if (this.interval <= 0) return BehaviorTree.Status.Failure;

            // 还走不完当前这一步
            if (this.interval > delay) {
                this.interval -= delay;

                var speed = this.entity.getSpeed();
                var x = this.direction.x*delay*speed;
                var z = this.direction.z*delay*speed;

                this.entity.setPosOffset(x,z);
                return BehaviorTree.Status.Runing;
            }

            // 走完了
            if (this.index >= this.pathPoint.length - 1) {
                this.interval = 0
                // TODO: 发现原例子中寻路出来的路线最后一个坐标不是终点，后面再看看
                //this.entity.setPos(this.dest.x,this.dest.z);

                return BehaviorTree.Status.Success;
            }

            // 走了不止一步
            var interval = this.interval;
            var src = this.pathPoint[this.index];
            this.index ++;
            this.moveNextStep(src,this.pathPoint[this.index]);

            return this.run(time,delay - interval);
        }
    }
}