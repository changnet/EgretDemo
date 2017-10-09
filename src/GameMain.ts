// 游戏主管理器
class GameMain {
    constructor() {
        // 主玩家对象，应该在收到服务器数据后创建。这里暂时只能伪造玩家的各种数据
        mainPlayer = entityManager.createNewPlayer(10000);
        mainPlayer.modelId = 100000;
    }

    // 主循环
    // @time 时间戳，应该是系统启动到当前时间的毫秒数
    // @delay 当前帧与上一帧的时间间隔，毫秒
    public update(time: number, delay: number) {
        if (mainPlayer) {
            mainPlayer.update(time,delay);
        }
        if (sceneManager) {
            sceneManager.update(time,delay);
        }
    }
}

let gameMain: GameMain = new GameMain();