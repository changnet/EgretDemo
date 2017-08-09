interface Page extends egret.DisplayObject {
    
    onEnterPage?: () => void;
    onLeavePage?: () => void;
}

class UIManager {

    private currentPage:Page;
    private loadingPage:LoadingPage;

    public static gameWidth  = 0;
    public static gameHeight = 0;

    constructor(private container:egret.DisplayObjectContainer) {
        UIManager.gameWidth = container.stage.stageWidth
        UIManager.gameHeight = container.stage.stageHeight
    }

    showPage(page:Page) {
        if (this.currentPage) {
            if (this.currentPage.onLeavePage) {
                this.currentPage.onLeavePage();
            }
            this.container.removeChild(this.currentPage);
            this.currentPage = null;
        }

        this.currentPage = page;
        this.container.addChild(page);

        if (page.onEnterPage) {
            page.onEnterPage();
        }
    }
}

let uiManager:UIManager;