// 配置管理类
// 有部分配置需要做二次处理，处理完后可以缓存到这里，避免每次加载页面时都处理一次
class ConfManager {

    private hashCache: {[key:string]:any} = {};
    private customCache: {[key:string]:any} = {};

    constructor() {
    }

    // 把数组类型的配置以指定字段为key转换为hash并返回
    public getHashConf(name: string,key: string) {
        if (name in this.hashCache) {
            return this.hashCache[name]
        }

        var hashConf = {}
        var rawConf = RES.getRes(name);
        for ( let one of rawConf ) {
            hashConf[one[key]] = one
        }

        return this.hashCache[name] = hashConf
    }

    // 获取配置，如果传入初始化函数，则会先初始化
    public getCustomConf(name: string,initFunc?: Function) {
        if (name in this.customCache) {
            return this.customCache[name]
        }
        var customConf = RES.getRes(name);
        if (initFunc) {
            customConf = initFunc(customConf);
        }

        return this.customCache[name] = customConf
    }

}

let confManager: ConfManager;