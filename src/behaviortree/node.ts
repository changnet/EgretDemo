// 行为树，可参考：https://github.com/behavior3/behavior3js

// 行为基类，所有行为都必须按此基类接口处理
namespace Behavior {
    export class Base {
        public onEnter(): void {            
        }

        public onExit(status: BehaviorTree.Status): void {
        }

        public run(time: number,delay: number): BehaviorTree.Status {
            console.log("null behavior run...")
            return BehaviorTree.Status.Failure;
        }
    }
}

namespace BehaviorTree {
    // 行为树节点状态
    export enum Status {
        None    = 0,  // 未开始
        Runing  = 1,  // 运行中
        Success = 2,  // 成功
        Failure = 3,  // 失败
    }

    // 行为树基础节点
    export class Node {
        private _status: Status;
        private obj: Behavior.Base;

        constructor(obj?: Behavior.Base) {
            this.obj = obj;
            this._status = Status.None;
        }

        // 重置
        public reset(): void {
            this._status = Status.None;
        }

        get status(): Status {
            return this._status;
        }

        set status(status: Status) {
            this._status = status;
        }

        get object():{[key:string]: any} {
            return this.obj;
        }

        // 在节点第一次调用时回调
        public onEnter() {
            if (this.obj) {
                this.obj.onEnter();
            }
        }

        // 在节点完成时回调
        public onExit(): Status {
            if (this.obj) {
                this.obj.onExit(this._status);
            }
            return this._status;
        }

        // 每帧调用
        public run(time: number, delay: number): Status {
            if (!this.obj) {
                console.log("BehaviorTree no run method found");
                return Status.Failure;
            }

            if (Status.Runing == this._status) {
                this._status = this.obj.run(time,delay);
            }
            else if (Status.None == this._status) {
                // 第一次
                this.onEnter();
                this._status = this.obj.run(time,delay);
            }
            else {
                console.log("BehaviorTree node run after exit");
                return Status.Failure;
            }

            // 得出结果
            if (Status.Failure == this._status 
                || Status.Success == this._status) {
                this.onExit();
                return this._status;
            }

            return this._status;
        }
    }
}