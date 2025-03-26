import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "res.json");
    const fileContents = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading res.json:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
