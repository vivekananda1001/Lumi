"use client";
import React, { useState, useRef, useEffect } from "react";
import { Menu, Settings, Plus, Mic } from "lucide-react";
import Card from "@/components/ui/card";
import wavEncoder from "wav-encoder";
import axios from 'axios'
interface Task {
  title: string;
  priority: "hi" | "md" | "lo";
  startTime: string;
  endTime: string;
}

export default function Dashboard() {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const changeLanguage = (language: string) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const toggleRecording = async () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      streamRef.current = stream;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);

      audioChunksRef.current = [];

      processor.onaudioprocess = (event) => {
        audioChunksRef.current.push(event.inputBuffer.getChannelData(0).slice());
      };

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !audioContextRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    const audioContext = audioContextRef.current;
    const audioBuffer = audioContext.createBuffer(
      1,
      audioChunksRef.current.reduce((a, b) => a + b.length, 0),
      audioContext.sampleRate
    );

    let offset = 0;
    const channel = audioBuffer.getChannelData(0);
    audioChunksRef.current.forEach(chunk => {
      channel.set(chunk, offset);
      offset += chunk.length;
    });

    const wavData = await wavEncoder.encode({
      sampleRate: audioContext.sampleRate,
      channelData: [channel],
    });

    const wavBlob = new Blob([wavData], { type: "audio/wav" });

    sendAudioToBackend(wavBlob);

    audioContext.close().then(() => {
      audioContextRef.current = null;
    });

    setRecording(false);
  };
  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    
    try {
      await fetch("/api/save-audio", {
        method: "POST",
        body: formData,
      });
      // console.log(JSON.stringify({ audio: "Backend/audio.wav" }));
      console.log("Audio successfully sent to backend");

      const jsonPayload = JSON.stringify({ audio: "Backend/audio.wav" });

        // Second fetch to transcribe audio using absolute URL with JSON body
        const response = await axios.post("http://localhost:8001/transcribe", jsonPayload, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });
      console.log("Response successfully recieved from backend");
      // if (!response.ok) {
      //     throw new Error('Transcription failed');
      // }
        
      const transcriptionResult =  response.data;
      const parsedResult = JSON.parse(transcriptionResult);
      console.log("Transcription result:", transcriptionResult);
      // console.log(parsedResult.response.tasks);

      setTasks(
          parsedResult.response.tasks.map((task: any) => ({
              title: task.title,
              priority: mapPriority(task.priority),
              startTime: task.startTime,
              endTime: task.endTime,
            }))
      );
      } catch (error) {
      console.error("Error sending audio:", error);
    }
  };

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       // const response = await fetch("/api/get-tasks");
  //       // const data = await response.json();
  //       // if (data?.response?.tasks) {
  //       //   setTasks(
  //       //     data.response.tasks.map((task: any) => ({
  //       //       title: task.title,
  //       //       priority: mapPriority(task.priority),
  //       //       startTime: task.startTime,
  //       //       endTime: task.endTime,
  //       //     }))
  //       //   );
  //       // }
  //     } catch (error) {
  //       console.error("Error fetching tasks:", error);
  //     }
  //   };
  
    // fetchTasks();
  //   const interval = setInterval(fetchTasks, 3000); // Poll every 5 seconds
  
  //   return () => clearInterval(interval);
  // }, []);
  

  const mapPriority = (priority: string): "hi" | "md" | "lo" => {
    switch (priority.toLowerCase()) {
      case "high":
        return "hi";
      case "medium":
        return "md";
      case "low":
        return "lo";
      default:
        return "lo";
    }
  };

  return (
    <div className="min-w-screen min-h-screen p-2 bg-blue-100">
      {/* Header */}
      <div className="fixed top-0 w-full bg-blue-100 z-10">
        <div className="flex items-center text-7xl font-bold m-4 justify-between">
          <div className="bg-gray-700 rounded-lg p-2 text-yellow-400 m-2">
            <Menu size={48} />
          </div>
          <div className="bg-gray-700 rounded-2xl p-3">
            <span className="text-yellow-400">
              L<span className="text-white">umi</span>
            </span>
          </div>
          <div className="bg-gray-700 rounded-lg p-2 text-yellow-400 m-2" onClick={toggleDropdown}>
            <Settings size={48} />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-40 text-2xl font-medium m-4">
                {["English", "Hindi", "Marathi", "Bengali"].map((language) => (
                  <div
                    key={language}
                    className={`px-4 py-2 text-gray-700 cursor-pointer hover:bg-blue-200 ${
                      selectedLanguage === language ? "font-bold text-yellow-400" : ""
                    }`}
                    onClick={() => changeLanguage(language)}
                  >
                    {language}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center flex-grow overflow-y-auto pt-32 pb-30">
        {tasks.map((task, index) => (
          <Card
            key={index}
            title={task.title}
            desc="Task Description" 
            startTime={task.startTime}
            endTime={task.endTime}
            priority={task.priority}
          />
        ))}
      </div>
      {/* Footer */}
      <div className="fixed bottom-0 w-full bg-blue-100 z-10">
        <div className="flex justify-around items-center m-4">
          <div className="bg-gray-600 rounded-lg p-2 text-yellow-400 m-2">
            <Plus size={48} />
          </div>
          <input className="bg-white p-4 w-5xl rounded-2xl outline-blue-400 outline-2" placeholder="What can I do for you today?" />
          <div
            className={`bg-gray-700 p-3 text-white m-2 rounded-full hover:text-yellow-400 transition-all duration-300 transform hover:scale-110 hover:w-[90px] ${
              recording ? "bg-red-500" : ""
            }`}
            onClick={toggleRecording}
          >
            <Mic size={60} />
          </div>
        </div>
      </div>
    </div>
  );
}
