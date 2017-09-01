// 游戏主管理器
class GameMain {
    constructor() {
        // 主玩家对象，应该在收到服务器数据后创建。这里暂时只能伪造玩家的各种数据
        mainPlayer = entityManager.createNewPlayer(10000);
        mainPlayer.modelId = 100000;
    }

    // 主循环
    public update(time: number, delay: number) {
        if (sceneManager) {
            sceneManager.update(time,delay);
        }
    }
}

let gameMain: GameMain = new GameMain();