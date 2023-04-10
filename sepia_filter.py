import cv2
import numpy as np

def apply_sepia(frame):
    # Convert the frame to a numpy array
    img = np.array(frame.to_ndarray(format="bgr24"))

    # Apply the Sepia filter to the image
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    sepia = np.array([[[0.393, 0.769, 0.189], [0.349, 0.686, 0.168], [0.272, 0.534, 0.131]]])
    sepia = np.uint8(sepia * 255)
    dst = cv2.filter2D(gray, -1, sepia)

    # Convert the filtered image back to a GStreamer buffer
    return np.ndarray(buffer=dst, dtype=np.uint8, shape=(frame.height, frame.width, 1)).tobytes()
