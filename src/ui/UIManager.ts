interface Page extends egret.DisplayObject {
    
    onEnterPage?: () => void;
    onLeavePage?: () => void;
}

class UIManager {

    private currentPage:Page;
    private loadingPage:LoadingPage;

    constructor(private container:egret.DisplayObjectContainer) {
        
    }

    showPage(page:Page) {
        this.currentPage = page;
        this.container.addChild(page);

        if (page.onEnterPage) {
            page.onEnterPage();
        }
    }
}

let uiManager:UIManager;