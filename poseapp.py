import streamlit as st
import cv2
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

st.set_page_config(page_title="Pose Detection with Streamlit")

st.title("Pose Detection with Streamlit")

# Create a VideoCapture object to capture the video stream
cap = cv2.VideoCapture(0)

# Create a Pose object to detect the pose landmarks
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:

    # Define a function to process each frame of the video stream
    def process_frame(frame):
        # Flip the frame horizontally for a mirror effect
        frame = cv2.flip(frame, 1)

        # Convert the BGR image to RGB.
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # To improve performance, optionally mark the image as not writeable to pass by reference.
        image.flags.writeable = False

        # Process the image and find poses
        results = pose.process(image)

        # Mark the image as writeable to draw landmarks on it.
        image.flags.writeable = True

        # Draw the pose landmarks on the image.
        mp_drawing.draw_landmarks(
            image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        return image

    # Create a canvas to display the video stream and the pose detections
    canvas = st.empty()

    while True:
        # Read a frame from the video stream
        ret, frame = cap.read()
        if not ret:
            continue

        # Process the frame
        processed_image = process_frame(frame)

        # Display the processed image and the video stream in the canvas
        canvas.image(cv2.hconcat([processed_image, frame]), caption='Pose Detection', use_column_width=True)

        # Break the loop when the user presses the 'Esc' key
        if cv2.waitKey(1) == 27:
            break

# Release the VideoCapture and destroy all windows
cap.release()
cv2.destroyAllWindows()
