// 游戏主管理器
class GameMain {
    constructor() {

    }

    // 主循环
    public update(time: number, delay: number) {
        if (sceneManager) {
            sceneManager.update(time,delay);
        }
    }
}

let gameMain: GameMain = new GameMain();