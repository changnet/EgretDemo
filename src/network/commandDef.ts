/* 这个文件要做个工具
 * 初步的想法是做一个简单通用的网格视图编辑，由配置文件指定网格字段，不可随意变更
 * 内容由json保存
 * 菜单里增加 导出客户端协议、导出服务器协议 功能，分别调用各自的exe文件(或者python等)
 */

const PLAYER = {
    package: "player",
    module: (0x01 << 8),  //256
    url: "resource/proto/player.proto",

    clt_cmd: [
        { cmd:0x01,object: "CLogin" },
        { cmd:0x03,object: "CCreateRole"},
        { cmd:0x04,object: "CEnterWorld"},
        //{ cmd:0x05,object: "CLoginOtherWhere"}
    ],
    srv_cmd: [
        { cmd:0x01,object: "SLogin" },
        { cmd:0x03,object: "SCreateRole"},
        { cmd:0x04,object: "SEnterWorld"},
        { cmd:0x05,object: "SLoginOtherWhere"}
    ]
};

const MODULES = [ PLAYER ];

const CPLAYER_LOGIN = PLAYER.module + 0x01;
const CPLAYER_CREATE = PLAYER.module + 0x03
const CPLAYER_ENTER = PLAYER.module + 0x04
//const CPLAYER_OTHER = PLAYER.module + 0x05

const SPLAYER_LOGIN = PLAYER.module + 0x01;
const SPLAYER_CREATE = PLAYER.module + 0x03
const SPLAYER_ENTER = PLAYER.module + 0x04
const SPLAYER_OTHER = PLAYER.module + 0x05
