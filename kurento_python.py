import sys
import numpy as np
import cv2
from gi.repository import GObject, Gst
from kurento_client import KurentoClient, MediaPipeline, Filters, WebRtcEndpoint

# Initialize the GStreamer loop
GObject.threads_init()
Gst.init(None)

# Create a Kurento client and connect to the Kurento Media Server
kurento_client = KurentoClient('ws://localhost:8888/kurento')
pipeline = MediaPipeline(kurento_client)

# Create a WebRTC endpoint to receive video frames
webRtcEndpoint = WebRtcEndpoint(pipeline)

# Create a filter to apply the Sepia effect
sepia_filter = Filters.create_filter(pipeline, 'GStreamerFilter', command='/Users/hmoole/Downloads/CCN/Project/WEBRTC/6166_Project-main/sepia_filter.py')

# Connect the WebRTC endpoint to the filter
webRtcEndpoint.connect(sepia_filter)

# Define a callback function to receive video frames from the pipeline
def on_frame(webRtcEndpoint, frame):
    # Convert the frame to a numpy array
    img = np
