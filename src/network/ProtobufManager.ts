class ProtoBufManager {
    private loadCnt: number = 0;
    private loadCall: Function;
    private cltCmdMap: {[key: number]: protobuf.Type} = {};
    private srvCmdMap: {[key: number]: protobuf.Type} = {};

    // 加载配置
    public loadConf(loadCall?: Function): void {
        this.loadCall = loadCall;
        for (let module of MODULES ) {
            let url = `resource/proto/${module.package}.proto`
            protobuf.load(url,(err: Error,root: protobuf.Root) =>{
                this.loadCnt ++;
                this.onOneLoaded(err,root,module);
            });
        }
        // protobuf会自动通过http获取文件
        // TODO: 旧版本还可以用loadproto加载文件内容，新版本没找到对应的函数，因此就不用egret的资源管理了
    }

    public onOneLoaded(err: Error,root: protobuf.Root,module: {[key:string]: any}): void {
        if ( err ) {
            throw err;
        }

        for ( let command of module["clt_cmd"] ) {
            var cmd = module["module"] + command["cmd"];
            var messageType = root.lookupType( `${module["package"]}.${command["object"]}`);

            this.cltCmdMap[cmd] = messageType
        }

        for ( let command of module["srv_cmd"] ) {
            var cmd = module["module"] + command["cmd"];
            var messageType = root.lookupType( `${module["package"]}.${command["object"]}`);

            this.srvCmdMap[cmd] = messageType
        }

        this.loadCnt --;
        if (0 == this.loadCnt && this.loadCall) {
            this.loadCall();
        }
    }

    // 把一个object编码成buffer
    public encode(cmd: number,pkt: {[key: string]: any}): Uint8Array
    {
        if (!this.cltCmdMap[cmd])
        {
            throw `clt message config not found:${cmd}`
        }
        var messageType : protobuf.Type = this.cltCmdMap[cmd]
        var message = messageType.create( pkt );

        return messageType.encode(message).finish();
    }

    // 把buffer解码成object
    public decode(cmd: number,buffer: Uint8Array): {[key: string]: any}
    {
        if (!this.srvCmdMap[cmd])
        {
            throw `srv message config not found:${cmd}`
        }
        var messageType : protobuf.Type = this.srvCmdMap[cmd]
        return messageType.decode(buffer);
    }
}

let protobufManager = new ProtoBufManager();
