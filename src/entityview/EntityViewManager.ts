class EntityViewManager {
    private entityViewMap: {[key:number]: EntityView} = {}

    public createPlayerView(entityId: number,modelId: number): PlayerView {
        var playerView = new PlayerView(entityId,modelId);

        this.entityViewMap[entityId] = playerView;
        return playerView;
    }
}

var entityViewManager:EntityViewManager = new EntityViewManager();