/* 与服务器逻辑通信socket连接
 */

class SrvSocket {
    private webSocket:egret.WebSocket;

    public connect( url: string,port: number ) {
        this.webSocket = new egret.WebSocket();        
        this.webSocket.addEventListener(
            egret.ProgressEvent.SOCKET_DATA, this.onRead, this);                            
        this.webSocket.addEventListener(
            egret.Event.CONNECT, this.onSocketOpen, this);    
        this.webSocket.connect("echo.websocket.org", 80);
    }

    private onRead( e:egret.Event ) {
        var msg = this.webSocket.readUTF();    
        console.log("收到数据：" + msg);
    }

    private onSocketOpen() : void {
        var cmd = "Hello Egret WebSocket";    
        console.log("连接成功，发送数据：" + cmd);    
        this.webSocket.writeUTF(cmd);
    }
}

let srvSocket: SrvSocket = new SrvSocket();
