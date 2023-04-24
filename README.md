# Name of the students in the group.
#### Group 5
- Alex Miller - 801072886
- Sarath Chillakuru - 801314925
- Harika Moole - 801318334
- Sri Datta Kiran Avasarala - 801318007
---
## Introduction about the selected project
We are going to do a project on 3D human modeling with WebRTC using a Python/Flask server backend and an Android front-end client. Here is a quick example video on Flask and WebRTC from YouTube that we might build off of to aid in our project.
https://youtu.be/ZvG1-s7QmLs

The server code is going to be deployed to a cloud service such as Heroku, AWS, or GCP, and we will use the WebRTC protocals to stream video data, that we will then send up to the server for processing. The server is also going to be running an AI engine, to do the human modeling. This github repo shows some of the code that we will use for the AI models
https://github.com/open-mmlab/mmhuman3dLinks
## What architecture you intend to use (client-server or standalone mobile application)
We plan on using a client-server model, with a Python/Flask server and an Android app as the client.

## Project plan based on two weeks iteration.
### Week 1:
1.	Research and gather requirements for the project
2.	Set up the WebRTC environment and infrastructure
3.	Implement the basic WebRTC functionality, including peer-to-peer communication, signal server setup, and data transfer
4.	Conduct initial testing of the WebRTC implementation
### Week 2:
1.	Integrate reinforcement learning into the WebRTC environment
2.	Design the reward system and implement the Q-Learning algorithm
3.	Conduct initial testing of the reinforcement learning functionality
4.  Conduct initial tesing of android app connecting to server via WebRTC
### Week 3-4:
1.	Refine the reinforcement learning algorithm based on the results of the initial testing
2.	Integrate additional WebRTC functionality, such as video and audio transmission
3.	Conduct further testing and debugging of the entire system
4.  Implement a video stream coming from the Android app
### Week 5-6:
1.	Finalize the reinforcement learning algorithm based on the results of testing
2.	Optimize the WebRTC environment for improved performance and scalability
3.	Conduct final testing and debugging of the entire system
4.  Connect the video stream to the Server via the WebRTC

### Week 7:
1.	Prepare for deployment and finalize any remaining tasks
2.	Complete documentation for the project.
3.	Deliver the final project and upload it onto canvas.

#### Iteration 1 :

We have implemented basic web video application using WebRTC. We have used Agora RTM SDK for the signalling process and importing some basic functionalities of the multimedia sessions. We have to run the uploaded index HTML file in branch group 5 iteration 1 which will setup the video session. The SDK imports all the packages necessary for the functionality of the multimedia messaging communication. This is a basic working application using WebRTC protocol.

1. Run the index HTML file in Visual Studio code.
2. It will take you to the local browser where camera access is requested.
3. Once camera access is allowed , you can see two users on the browser screen communicating over the network.
4. The signalling process is enabled by the SDK which will enable the video multimedia sessions.


#### Iteration 2:
We have implemented the server component of the web video application using WebRTC. We have switched over to using the kurento library to replace the agora library, as the kurento library has a lot more functionality for editing video streams in real time. We have also implemented package management, using node_modules and webpack for packaging up the client side javascript. 

Some notes for whoever wants to run this project:
- Install docker desktop and get docker desktop running
- docker pull kurento/kurento-media-server
- docker run -d --name kurento-media-server -p 8888:8888 kurento/kurento-media-server
    - This is the kurento media server that processes the video
    - Kurento Media Server (KMS) is a multimedia server package that can be used to develop advanced video applications for WebRTC platforms
- npm install
- npm start
- http://localhost:3000/streamer (for streaming video to the server, the video shown is local)
- http://localhost:3000/viewer (for recieving the video stream from the server, this video is processed)
- Will be looking into the following options to implement a computer vision filter into the video stream:
    - https://gstreamer.freedesktop.org/documentation/plugin-development/index.html
    - https://gstreamer.freedesktop.org/documentation/compositor/index.html
    - https://gstreamer.freedesktop.org/documentation/pango/textoverlay.html
- This is how we will integrate with mmhuman3d library:
- https://github.com/open-mmlab/mmhuman3d
```
const filter = await pipeline.create('GStreamerFilter', {
command: 'python(pyfile=<path_to_custom_script.py>)',
});
```

Iteration 4 :

Due to limitations in Gstreamer, we are unable to read python script in Kurento pipeline. Hence at the last iteration , we had to implement a new project altogether. We have to decided to implement pose detection as per our project using Streamlit and Mediapipe's Holistic model. Streamlit has the WebRTC protocol inbuilt and would help us to deploy applications over the web. With the help of Mediapipe libraries , we are able to predict the pose by taking the webcam's camera as input. 

To run the project, all we need is to dowmload the zip file and then run the mail poseapp.py using any Python IDE. We can run directly from the terminal using the command 

streamlit run poseapp.py

We will be merging the branch iteration 4 only to the main as this is the new project and previous iterations has to be discarded.

