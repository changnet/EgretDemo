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
        console.log( "socket 22222222222222222" )
        var bytes = new egret.ByteArray();
        this.webSocket.readBytes(bytes);
        console.log("收到数据：" + bytes.length);
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
        var buffer = protobufManager.encode( cmd,pkt )
        var bytes = new egret.ByteArray( buffer )
        this.webSocket.writeBytes( bytes )
        this.webSocket.flush();
    }
}

let srvSocket: SrvSocket = new SrvSocket();
