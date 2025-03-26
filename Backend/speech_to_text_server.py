import os
import azure.cognitiveservices.speech as speechsdk
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests
app = Flask(__name__)
CORS(app, resources={r"/*":{"origins":["http://localhost:3000"]}})

# Environment variable setup
SPEECH_KEY = os.environ.get("SPEECH_KEY")
SERVICE_REGION = os.environ.get("SPEECH_REGION")

if not SPEECH_KEY or not SERVICE_REGION:
    raise Exception("Please set SPEECH_KEY and SPEECH_REGION environment variables.")

def transcribe_audio(audio_path):
    """Transcribes an audio file using Azure Speech-to-Text with continuous recognition."""
    print(audio_path)

    try:
        AUDIO_FILE_PATH = os.path.abspath("audio.wav")
        print(AUDIO_FILE_PATH)
        assert os.path.exists(AUDIO_FILE_PATH), f"File not found: {AUDIO_FILE_PATH}"
        # Validate audio file existence
        # if not os.path.exists(audio_path):
        #     return "Audio file not found"

        # Configure speech recognition
        speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SERVICE_REGION)
        speech_config.speech_recognition_language = "en-US"
        audio_config = speechsdk.AudioConfig(filename=AUDIO_FILE_PATH)
        
        speech_recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config, 
            audio_config=audio_config
        )
        recorded_text=""
        # Use a local list to collect transcription (thread-safe)
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
        
        # Handle recognition completion
        
        
        # def stop_cb(evt):
        #     """Callback to stop recognition."""
        #     nonlocal done
        #     done = True
        #     speech_recognizer.stop_continuous_recognition()
        
        # Connect stop and cancel events
        # speech_recognizer.session_stopped.connect(stop_cb)
        # speech_recognizer.canceled.connect(stop_cb)
        
        # Start continuous recognition
        result = speech_recognizer.recognize_once()
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            return result.text.strip()
        elif result.reason == speechsdk.ResultReason.NoMatch:
            return "Not Understandable"
        # Wait for recognition to complete
        # while not done:
        #     pass
        
        # Return combined transcription or an appropriate message
    
    except Exception as e:
        return f"Error processing audio: {str(e)}"

@app.route("/transcribe", methods=["POST"])

def transcribe_endpoint():
    """Endpoint to receive a JSON request with audio filename and return transcribed text."""
    # Ensure the request is JSON
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    # Parse JSON data
    data = request.get_json()
    if "audio" not in data:
        return jsonify({"error": "Missing 'audio' key in JSON"}), 400

    # Extract filename and construct file path
    filename = data["audio"]
    print(filename)
    # Transcribe the audio file
    recorded_text = transcribe_audio(filename)
    print(recorded_text)
    TOKEN = "Bearer your_jwt_token_here"
    server_url = "http://localhost:8000/api/gpt"
    data = {"query": recorded_text.strip()}
    headers = {"Authorization": TOKEN, "Content-Type": "application/json"}
    # print("this is Recorded text: ",recorded_text)
    try:
        response = requests.post(server_url, json=data, headers=headers)
        print("Response from server:", response.text)
    except Exception as e:
        print("Error sending data to server:", e)
    return jsonify(response.text)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001, debug=True)