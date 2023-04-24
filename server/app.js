const express = require('express');
const WebSocket = require('ws');
const kurento = require('kurento-client');
const path = require('path');
const fs = require('fs');


const app = express();
const port = 3000;

const wss = new WebSocket.Server({ port: 8080 });
const kurentoUrl = 'ws://localhost:8888/kurento';

const logFilePath = path.join(__dirname, 'logs.txt');

let candidatesQueue = {};
let kurentoClient = null;
let streamerWebRtcEndpoint = null;

let viewers = [];

function logToFile(prefix, data) {
  const message = `[${new Date().toISOString()}] ${prefix} ${data}\n`;

  fs.appendFile(logFilePath, message, (err) => {
    if (err) {
      console.error(`Error writing log to file: ${err}`);
    }
  });
}

// Set up WebSocket server
wss.on('connection', async (ws) => {
  ws.id = Date.now().toString();
  ws.on('message', async (message) => {
    // logToFile('Message: ', message)
    const parsedMessage = JSON.parse(message);
    switch (parsedMessage.id) {
      case 'start':
        await start(ws, parsedMessage);
        break;

      case 'onIceCandidate':
        onIceCandidate(ws, parsedMessage);
        break;
    }
  });

  ws.on('error', (error) => {
    // logToFile('Error:', error);
  });
  
  ws.on('close', (code, reason) => {
    // logToFile('Closed:', code, reason);
  });
});


let pipeline; 

async function start(ws, message) {
  if (!kurentoClient) {
    kurentoClient = await kurento(kurentoUrl);
  }

  if (!pipeline) {
    pipeline = await kurentoClient.create('MediaPipeline');
  }

  const webRtcEndpoint = await pipeline.create('WebRtcEndpoint');
  ws.webRtcEndpoint = webRtcEndpoint;

  if (message.role === 'streamer') {
    /* const filter = await pipeline.create('GStreamerFilter', {
      command: 'videobalance saturation=0.0',
    }); */

    const filter = await pipeline.create('GStreamerFilter', {
      command: 'python(pyfile=</Users/hmoole/Downloads/CCN/Project/Iterations/6166_Project-group_5_iteration_2/pose.py>)',
    });
    

    await webRtcEndpoint.connect(filter);
    streamerWebRtcEndpoint = filter;

    console.log('viewers', viewers)
    for (const viewerEndpoint of viewers) {
      await streamerWebRtcEndpoint.connect(viewerEndpoint);
    }
    viewers = [];

  } else if (message.role === 'viewer') {
    if (streamerWebRtcEndpoint) {
      await streamerWebRtcEndpoint.connect(webRtcEndpoint);
      console.log(`Connected streamerWebRtcEndpoint to viewer: ${ws.id}`);
    } else {
      viewers.push(webRtcEndpoint);
      console.log('viewers', viewers)
    }
  }

  if (candidatesQueue[ws.id]) {
    while (candidatesQueue[ws.id].length) {
      const candidate = candidatesQueue[ws.id].shift();
      webRtcEndpoint.addIceCandidate(candidate);
    }
  }

  webRtcEndpoint.on('IceCandidateFound', (event) => {
    const candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
    ws.send(JSON.stringify({ id: 'iceCandidate', candidate }));
  });

  const sdpAnswer = await webRtcEndpoint.processOffer(message.sdpOffer);
  await webRtcEndpoint.gatherCandidates();

  ws.send(JSON.stringify({ id: 'startResponse', sdpAnswer }));
}

function onIceCandidate(ws, message) {
  const candidate = kurento.register.complexTypes.IceCandidate(message.candidate);

  if (ws.webRtcEndpoint) {
    console.log('Adding ICE candidate');
    ws.webRtcEndpoint.addIceCandidate(candidate);
  } else {
    if (!candidatesQueue[ws.id]) {
      candidatesQueue[ws.id] = [];
    }
    candidatesQueue[ws.id].push(candidate);
  }
}

app.use(express.static('public'));

app.get('/streamer', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/streamer.html'));
});

app.get('/viewer', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/viewer.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
