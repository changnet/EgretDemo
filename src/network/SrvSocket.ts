/* 与服务器逻辑通信socket连接
 */

class SrvSocket {
    private isOpen: boolean = false;
    private webSocket:egret.WebSocket;

    public connect( url: string,port: number ) {
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
        var errno = bytes.readShort();
        var buffer = new egret.ByteArray();
        bytes.readBytes(buffer,0,0);

        var pkt = protobufManager.decode(cmd,buffer.bytes);

        console.log("收到数据：" + bytes.length,cmd,errno,pkt);
    }

    private onSocketOpen() : void {
        this.isOpen = true;
        console.log( "socket open" )
    }

    private onSocketClose() : void {
        this.isOpen = false
        console.log( "socket close" )
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
