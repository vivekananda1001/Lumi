import fetch from 'node-fetch';
import 'dotenv/config';
const API_KEY = process.env.API_KEY;
const ENDPOINT = process.env.ENDPOINT;

async function callGptModel(messages) {
  const headers = {
    "Content-Type": "application/json",
    "api-key": API_KEY,
  };

  const data = {
    messages,
    model: "gpt-4",
    max_tokens: 1000,
    response_format: { type: "json_object" }, // Ensure JSON output
  };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const json = await response.json();
    return json.choices[0].message.content;
  } catch (error) {
    console.log("API KEY", API_KEY);
    console.log("ENDPOINT", ENDPOINT);
    throw new Error(`GPT API call failed: ${error.message}`);
  }
}

export default callGptModel;