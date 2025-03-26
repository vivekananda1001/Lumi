import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ message: "No audio file received" }, { status: 400 });
    }

    const buffer = Buffer.from(await audioFile.arrayBuffer());

    const savePath = path.join(process.cwd(), "../lumi-BE/recorded_audio.wav");

    await writeFile(savePath, buffer);
    console.log("Audio saved successfully at:", savePath);

    return NextResponse.json({ message: "Audio saved successfully" });
  } catch (error) {
    console.error("Error saving audio:", error);
    return NextResponse.json({ message: "Error saving audio" }, { status: 500 });
  }
}
