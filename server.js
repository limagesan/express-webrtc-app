var express = require("express");
var app = express();
var ExpressPeerServer = require("peer").ExpressPeerServer;

// herokuにデプロイするため環境変数PORTの値を取れるようにしておく
app.set("port", process.env.PORT || 9000);
// ルートへのアクセスでpublicフォルダ以下を返す
app.use("/", express.static(__dirname + "/public"));

// 以下シグナリングサーバの宣言
var options = {
    debug: true
};

var server = require("http").createServer(app);
var peerServer = ExpressPeerServer(server, options);
app.use("/peerjs", peerServer);

// ピア接続ができたときのイベント
peerServer.on("connection", id => {
    console.log("on connection", id);
});

// ピア接続が切れた時のイベント
peerServer.on("disconnect", id => {
    console.log("on disconnect", id);
});

// app.set('port')でセットしたポート番号を解放
server.listen(app.get("port"), () => {
    console.log("listen port", app.get("port"));
});
