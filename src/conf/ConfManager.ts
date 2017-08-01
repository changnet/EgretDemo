class ConfManager {

    private confMap = {};

    public setConf(name: string,conf: any) {
        this.confMap[name] = conf;
    }

    public getConf(name: string) {
        return this.confMap[name]
    }
    
}

let confManager: ConfManager;