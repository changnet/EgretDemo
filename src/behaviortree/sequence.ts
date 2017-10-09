namespace BehaviorTree {

    // 行为树顺序节点
    // 依次执行所有的子节点,其中一个节点失败时终止执行并返回失败
    // 所有节点成功时返回成功
    export class Sequence extends Node {
        private nodes: Node[];
        private index: number;

        constructor(nodes: Node[]) {
            super();

            this.index = 0;
            this.nodes = nodes;
        }

        // 重置
        public reset(): void {
            this.index = 0;

            for (let node of this.nodes ) {
                node.reset();
            }
        }

        // 每帧回调
        public run(): Status {
            if (this.status > Status.Runing) {
                console.log("BehaviorTree sequence still run after exit");
                return this.status
            }

            
        }
    }
}