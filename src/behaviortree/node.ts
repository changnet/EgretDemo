// 行为树，可参考：https://github.com/behavior3/behavior3js

namespace BehaviorTree {
    // 行为树节点状态
    export enum Status {
        None    = 0,  // 未开始
        Runing  = 1,  // 运行中
        Success = 2,  // 成功
        Failure = 3,  // 失败
    }

    // 行为函数接口
    interface RunFunction {
        // https://www.typescriptlang.org/docs/handbook/interfaces.html
        (): boolean;
    }

    // 行为对象接口
    interface Object {
        onEnter?: Function;
        onExit?: Function;
        run: RunFunction;
    }

    // 行为树基础节点
    export class Node {
        private _status: Status;
        private obj: Object;

        constructor(obj?: Object) {
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
            if (this.obj && this.obj["onEnter"]) {
                this.obj["onEnter"]();
            }
        }

        // 在节点完成时回调
        public onExit(): Status {
            if (this.obj && this.obj["onExit"]) {
                this.obj["onExit"](this._status);
            }
            return this._status;
        }

        // 每帧调用
        public run(): Status {
            if (!this.obj) {
                console.log("BehaviorTree no run method found");
                return Status.Failure;
            }

            return this._status;
        }
    }
}