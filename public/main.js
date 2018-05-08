var peer;
var userId;
const userVideo = document.getElementById("user-video");
const partnerVideo = document.getElementById("partner-video");

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", login);

const callButton = document.getElementById("call-button");
callButton.addEventListener("click", call);

function login(event) {
  userId = document.getElementById("user-id").value;

  // シグナリングサーバとPeer(WebSocket)接続
  peer = new Peer(userId, {
    host: "YOUR_DOMAIN",
    port: 443,
    path: "/peerjs",
    secure: true
  });

  // Peer接続に成功したら呼ばれるイベント
  peer.on("open", id => {
    console.log("opened", id);

    // ユーザーのカメラ映像・音声取得
    const constraints = { audio: true, video: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        window.stream = stream;
        userVideo.srcObject = stream;
      })
      .catch(err => {
        console.error("failed getUserMedia", err);
      });

    // callされたら呼ばれるイベント
    peer.on("call", call => {
      console.log("catch call");
      call.answer(window.stream);

      // 相手のストリーム(映像・音声)が来たら呼ばれるイベント
      call.on("stream", stream => {
        console.log("catch stream");
        partnerVideo.srcObject = stream;
      });
    });
  });
}

function call(event) {
  const partnerId = document.getElementById("partner-id").value;
  const mediaConnection = peer.call(partnerId, window.stream);

  mediaConnection.on("stream", stream => {
    console.log("catch stream");
    partnerVideo.srcObject = stream;
  });
}
