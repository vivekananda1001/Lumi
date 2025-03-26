import os
import requests
import azure.cognitiveservices.speech as speechsdk

SPEECH_KEY = os.environ.get("SPEECH_KEY")
SERVICE_REGION = os.environ.get("SPEECH_REGION")
AUDIO_FILE_PATH = os.path.abspath("Backend/audio.wav")
print(AUDIO_FILE_PATH)
assert os.path.exists(AUDIO_FILE_PATH), f"File not found: {AUDIO_FILE_PATH}"
if not SPEECH_KEY or not SERVICE_REGION:
    raise Exception("Please set SPEECH_KEY and SERVICE_REGION environment variables.")

language_code = "en-US"  # Set your desired language code
print("Language Code:", language_code)

speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SERVICE_REGION)
speech_config.speech_recognition_language = language_code

audio_config = speechsdk.AudioConfig(filename=AUDIO_FILE_PATH)
speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

recorded_text = ""

def recognized_callback(evt):
    global recorded_text
    if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
        text = evt.result.text.strip()
        if text:
            recorded_text += text + " "
        print("Recognized text:", text)
    elif evt.result.reason == speechsdk.ResultReason.NoMatch:
        print("No match found.")

speech_recognizer.recognized.connect(recognized_callback)
print("Processing audio file...")

result = speech_recognizer.recognize_once()

if result.reason == speechsdk.ResultReason.RecognizedSpeech:
    recorded_text = result.text.strip()
    print("Recognized text:", recorded_text)
elif result.reason == speechsdk.ResultReason.NoMatch:
    print("No match found.")

print("Final Transcription:", recorded_text)

TOKEN = "Bearer your_jwt_token_here"
server_url = "http://localhost:8000/api/gpt"
data = {"query": recorded_text.strip()}
headers = {"Authorization": TOKEN, "Content-Type": "application/json"}

try:
    response = requests.post(server_url, json=data, headers=headers)
    print("Response from server:", response.text)
except Exception as e:
    print("Error sending data to server:", e)
