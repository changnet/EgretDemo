/* 与服务器逻辑通信socket连接
 */

class SrvSocket {
    private isOpen: boolean = false;
    private webSocket:egret.WebSocket;

    // TODO: 目前这些回调都只允许单个回调，以后有需求再改改
    private statusCall: Function;// Function[] = [];
    private cmdCall: {[key:number]: Function} = {};

    public valid(): boolean {
        return this.isOpen;
    }

    public registerCommand(cmd: number,callback: Function,thisObj?: any): void {
        if (this.cmdCall[cmd]) {
            throw `dumplate register command ${cmd}`;
        }
        // 不知道是用一个object分别保存callback和thisObj还是创建一个函数效率高些...
        this.cmdCall[cmd] = (ecode,...args) => callback.call(thisObj,ecode,...args);
    }

    public unregisterCommand(cmd: number): void {
        this.cmdCall[cmd] = undefined;
    }

    public registerStatus(callback: Function,thisObj?: any): void {
        this.statusCall = () => callback.call(thisObj);
    }

    public unregisterStatus(): void {
        this.statusCall = undefined;
    }

    public connect( url: string,port: number ) {
        if (this.isOpen) {
            throw "srvSocket already open";
        }
        this.webSocket = new egret.WebSocket();

        this.webSocket.type = egret.WebSocket.TYPE_BINARY
        this.webSocket.addEventListener(
            egret.ProgressEvent.SOCKET_DATA, this.onRead, this);
        this.webSocket.addEventListener(
            egret.Event.CONNECT, this.onSocketOpen, this);
        this.webSocket.addEventListener(
            egret.Event.CLOSE, this.onSocketClose, this);
        this.webSocket.addEventListener(
            egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        this.webSocket.connect(url,port);
    }

    private onRead( e:egret.Event ) {
        var bytes = new egret.ByteArray();
        this.webSocket.readBytes(bytes);
        var cmd = bytes.readShort();
        var ecode = bytes.readShort();
        var buffer = new egret.ByteArray();
        bytes.readBytes(buffer,0,0);

        var pkt = protobufManager.decode(cmd,buffer.bytes);

        console.log("收到数据：" + bytes.length,cmd,ecode,pkt["pid"],pkt["name"]);
        var callback = this.cmdCall[cmd]
        if (!callback) {
            console.warn(`command recv,no callback founnd:${cmd}`);
            return;
        }

        callback.call(ecode,pkt);
    }

    private onSocketOpen() : void {
        this.isOpen = true;
        console.log( "socket open" )
        if (this.statusCall) {
            this.statusCall( this.isOpen );
        }
    }

    private onSocketClose() : void {
        this.isOpen = false
        console.log( "socket close" )
        if (this.statusCall) {
            this.statusCall( this.isOpen );
        }
    }

    private onSocketError() :void {
        this.isOpen = false
        console.log("socket error")
    }

    public send(cmd: number,pkt: {[key:string]: any}): void {
        if (!this.isOpen) {
            console.log( "send cmd with closed socket",cmd);
            return;
        }
        var buffer = protobufManager.encode( cmd,pkt )

        var bytes = new egret.ByteArray()
        bytes.writeShort(cmd);
        // 不能直接写入uintAttry ？？？只有构造函数和private函数_writeUint8Array
        bytes.writeBytes(new egret.ByteArray(buffer));
        this.webSocket.writeBytes( bytes )
        this.webSocket.flush();
    }
}

let srvSocket: SrvSocket = new SrvSocket();
