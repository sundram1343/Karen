const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function buildMessageFromFile(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  let content = '';
  
  if (ext === '.txt') {
    content = fs.readFileSync(filepath, 'utf8');
  } else if (ext === '.pdf') {
    const buffer = fs.readFileSync(filepath);
    const parsed = await pdfParse(buffer);
    content = parsed.text;
  } else {
    content = `User uploaded file: ${filepath} (type: ${ext})`;
  }
  
  return { role: 'user', content: `Attached File Content:\n${content}` };
}
async function message(usermessage, filepath) {
  try {
    const fileMessage = filepath ? await buildMessageFromFile(filepath) : null;

    const systemPrompt = `You are an AI virtual assistant intent parser.
      Analyze the user command and determine if an action is needed.

      Available Functions:
      - openApp (parameter: appName)
      - searchWeb (parameter: query)

      You MUST respond strictly with a JSON object.

      If the command requires an action:
      {
        "type": "action",
        "function": "<function_name>",
        "parameter": "<value>"
      }

      If no action is required (conversational query):
      {
        "type": "chat",
        "response": "<your response text>"
      }`;
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(fileMessage ? [fileMessage] : []),
      { role: 'user', content: usermessage }
    ]
    const chatCompletion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      response_format: { type: "json_object" }
    });
    const rawContent = chatCompletion.choices[0].message.content;
    return JSON.parse(rawContent);
  } catch (error) {
    console.error("Error processing message:", error);
    return { type: "chat", response: "Sorry, I encountered an internal error." };
  }
}
module.exports = { message };