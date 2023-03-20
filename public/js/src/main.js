import kurentoUtils from "kurento-utils";

let ws = new WebSocket("ws://localhost:8080");

let videoOutput;
let webRtcPeer;
const role = window.location.pathname === "/streamer" ? "streamer" : "viewer";

ws.onmessage = function (message) {
  const parsedMessage = JSON.parse(message.data);
  switch (parsedMessage.id) {
    case "startResponse":
      handleStartResponse(parsedMessage);
      break;

    case "iceCandidate":
      handleIceCandidate(parsedMessage);
      break;

    default:
      console.error("Unrecognized message:", parsedMessage);
  }
};

function start(role) {
  videoOutput = document.getElementById("video");

  const options = {
    onicecandidate: onIceCandidate,
    configuration: {
      iceServers: [{
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      }
      ]
    }
  };

  if (role === "streamer") {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        videoOutput.srcObject = stream;
        videoOutput.muted = true;
        videoOutput.autoplay = true;
        
        webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function (error) {
          if (error) {
            return console.error(error);
          }
          webRtcPeer.generateOffer(onOfferGenerated);
        });

        webRtcPeer.peerConnection.addTrack(stream.getVideoTracks()[0], stream);
      })
      .catch(function (error) {
        console.error(error);
      });
  } else if (role === "viewer") {
    options.remoteVideo = videoOutput;
    // Add a callback for the 'ontrack' event to display the received video stream
    options.ontrack = function (event) {
      console.log("Received video track:", event);
      videoOutput.srcObject = event.streams[0];
      videoOutput.autoplay = true;
    };

    webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function (error) {
      if (error) {
        return console.error(error);
      }
      webRtcPeer.generateOffer(onOfferGenerated);
    });
  }
}


function onOfferGenerated(error, sdpOffer) {
  if (error) {
    return console.error("Error generating offer:", error);
  }

  const role = window.location.pathname === "/streamer" ? "streamer" : "viewer";
  const message = { id: "start", role, sdpOffer }
  ws.send(JSON.stringify(message));
}


function handleStartResponse(message) {
  webRtcPeer.processAnswer(message.sdpAnswer);
}

function handleIceCandidate(message) {
  const candidate = {
    candidate: message.candidate.candidate,
    sdpMid: message.candidate.sdpMid,
    sdpMLineIndex: message.candidate.sdpMLineIndex,
  };
  try {
    webRtcPeer.addIceCandidate(candidate);
  } catch (error) {
    console.log(error)
  }
}

function onIceCandidate(candidate) {
  ws.send(JSON.stringify({ id: "onIceCandidate", candidate }));
}

start(role);

