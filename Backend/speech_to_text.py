import os
import requests
import azure.cognitiveservices.speech as speechsdk

# Load environment variables
SPEECH_KEY = os.environ.get("SPEECH_KEY")
SERVICE_REGION = os.environ.get("SPEECH_REGION")
if not SPEECH_KEY or not SERVICE_REGION:
    raise Exception("Please set SPEECH_KEY and SERVICE_REGION environment variables.")

# Prompt the user for the language code
language_code = input("Enter the language code for recognition (e.g., 'en-US', 'hi-IN'): ").strip()
# language_code = os.environ.get("LANG")
print(language_code)
speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SERVICE_REGION)
speech_config.speech_recognition_language = language_code

audio_config = speechsdk.AudioConfig(use_default_microphone=True)
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

# Variable to accumulate recognized text
recorded_text = ""

def recognizing_callback(evt):
    # Optionally print partial results
    print("Recognizing (partial):", evt.result.text)

def recognized_callback(evt):
    global recorded_text
    if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
        text = evt.result.text.strip()
        if text:
            recorded_text += text + " "
        print("Recognized text:", text)
    elif evt.result.reason == speechsdk.ResultReason.NoMatch:
        print("No match found.")

def session_started_callback(evt):
    print("Session started.")

def session_stopped_callback(evt):
    print("Session stopped.")

def canceled_callback(evt):
    print("Canceled: Reason={}, ErrorDetails={}".format(evt.reason, evt.error_details))

# Connect the event callbacks
speech_recognizer.recognizing.connect(recognizing_callback)
speech_recognizer.recognized.connect(recognized_callback)
speech_recognizer.session_started.connect(session_started_callback)
speech_recognizer.session_stopped.connect(session_stopped_callback)
speech_recognizer.canceled.connect(canceled_callback)

print("Listening... (speak into your microphone)")
speech_recognizer.start_continuous_recognition()

# Wait until Enter is pressed
input("Press Enter to stop recognition...\n")

print("Stopping recognition...")
speech_recognizer.stop_continuous_recognition()

# Hardcoded JWT token for testing (replace with your actual token)
TOKEN = "Bearer your_jwt_token_here"

# Define the server URL and request data
server_url = "http://localhost:8000/api/gpt"  # Adjust port and path as needed
data = {"query": recorded_text.strip()}  # Use "query" as the key for /gpt endpoint

# Set headers with the JWT token
headers = {
    "Authorization": TOKEN,
    "Content-Type": "application/json"
}

# Send the transcribed text to the /gpt endpoint
try:
    response = requests.post(server_url, json=data, headers=headers)
    print("Response from server:", response.text)
except Exception as e:
    print("Error sending data to server:", e)