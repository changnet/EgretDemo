class ProtoBufManager {
    private loadCnt: Number = 0;
    private cmdMap: {[key: string]: any} = {};

    // 加载配置
    public loadConf(): void {
        for (let module of MODULES ) {
            protobuf.load(module.url,(err: Error,root: protobuf.Root) =>{
                this.onOneLoaded(err,root,module);
            });
        }
        // protobuf会自动通过http获取文件
        // 旧版本还可以用loadproto加载文件内容，新版本没找到对应的函数，因此就不用egret的resourceManager了
        // protobuf.load("resource/proto/player.proto",function( err: Error,root: protobuf.Root ){
        //     if ( err ) {
        //         console.log("load proto file error");
        //         throw err;
        //     }
        //     var messageType = root.lookupType("player.CLogin");
        //     var message = messageType.create( {sid:1,time:2,plat:3,sign:"sign",account:"test"} );

        //     var buffer = messageType.encode( message ).finish();

        //     var newMessage = messageType.decode( buffer );
    }

    public onOneLoaded(err: Error,root: protobuf.Root,module: {[key:string]: any}): void {
        if ( err ) {
            throw err;
        }

        console.log( module );
    }

    // 把一个object编码成buffer
    public encode(cmd: Number,pkt: {[key: string]: any}): Uint8Array
    {
        var buffer: Uint8Array;
        return buffer;
    }

    // 把buffer解码成object
    public decode(cmd: Number,buffer: Uint8Array): {[key: string]: any}
    {
        return undefined;
    }
}

let protobufManaer = new ProtoBufManager();
