namespace BehaviorTree {

    // 行为树循环节点,如果循环次数为-1，则无限循环
    // 重复执行自节点，失败时终止执行并返回失败
    // 达到指定条件（如执行次数之前）自己都处于running
    export class Repeat extends Node {
        // to be implemented
    }
}