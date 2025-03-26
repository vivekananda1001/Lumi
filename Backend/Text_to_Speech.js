import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import readline from "readline";
import player from "node-wav-player";

// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
speechConfig.speechSynthesisVoiceName ="hi-IN-SwaraNeural";
function createAudioConfig(audioFile) {
  return sdk.AudioConfig.fromAudioFileOutput(audioFile);
}

function createSpeechSynthesizer(audioConfig) {
  return new sdk.SpeechSynthesizer(speechConfig, audioConfig);
}

function synthesizeText(text, audioFile) {
  const audioConfig = createAudioConfig(audioFile);
  let synthesizer = createSpeechSynthesizer(audioConfig);

  synthesizer.speakTextAsync(text,
    function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails +
            "\nDid you set the speech resource key and region values?");
      }
      synthesizer.close();
      synthesizer = null;
    },
    function (err) {
      console.trace("err - " + err);
      synthesizer.close();
      synthesizer = null;
    });
    player.play({ path: audioFile })
          .then(() => console.log("Audio played successfully"))
          .catch((err) => console.error("Error playing audio:", err));
  console.log("Now synthesizing to: " + audioFile);
}

function promptUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter some text that you want to speak >\n> ", function (text) {
    rl.close();
    synthesizeText(text, "YourAudioFile.wav");
  });
}

export { synthesizeText, promptUser };
