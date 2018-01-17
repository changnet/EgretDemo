// AUTO GENERATE,DO NOT MODIFY

const PLAYER = {
    package: "player",
    module: (0x01 << 8),

    clt_cmd: [
        { cmd:0x01,object:"CLogin" },
        { cmd:0x02,object:"CPing" },
        { cmd:0x03,object:"CCreateRole" },
        { cmd:0x04,object:"CEnterWorld" },

    ],
    srv_cmd: [
        { cmd:0x01,object:"SLogin" },
        { cmd:0x02,object:"SPing" },
        { cmd:0x03,object:"SCreateRole" },
        { cmd:0x04,object:"SEnterWorld" },
        { cmd:0x05,object:"SLoginOtherWhere" },

    ]
};


const MODULES = [ PLAYER ];

const CPLAYER_LOGIN = PLAYER.module + 0x01;
const SPLAYER_LOGIN = PLAYER.module + 0x01;
const CPLAYER_PING = PLAYER.module + 0x02;
const SPLAYER_PING = PLAYER.module + 0x02;
const CPLAYER_CREATE = PLAYER.module + 0x03;
const SPLAYER_CREATE = PLAYER.module + 0x03;
const CPLAYER_ENTER = PLAYER.module + 0x04;
const SPLAYER_ENTER = PLAYER.module + 0x04;
const SPLAYER_OTHER = PLAYER.module + 0x05;


