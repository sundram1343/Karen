const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function buildMessageFromFile(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  let content = "";
  if (ext === ".txt") {
    content = fs.readFileSync(filepath, "utf8");
  } else if (ext === ".pdf") {
    const buffer = fs.readFileSync(filepath);
    const parsed = await pdfParse(buffer);
    content = parsed.text;
  } else {
    content = `User uploaded file: ${filepath} (type: ${ext})`;
  }
  return { role: "user", content: `Attached File Content:\n${content}` };
}
async function message(usermessage, filepath) {
  try {
    const fileMessage = filepath ? await buildMessageFromFile(filepath) : null;
    const systemPrompt = `
You are Karen, a personal AI assistant.Runnig on android platform.

You have TWO capabilities:

1. CONVERSATION
Answer the user's questions normally.
Have natural conversations.
Explain concepts.
Help with coding, study, planning, general questions, etc.

2. ACTION EXECUTION
When the user explicitly asks you to perform an action on their device,
generate an action plan using the available functions.

Return ONLY valid JSON.

For normal conversation:

{
  "type": "response",
  "response": "your natural response"
}

For device actions:

{
  "type": "actions",
  "response": "a short natural response to the user",
  "actions": [
    {
      "function": "function_name",
      "args": {}
    }
  ]
}

Do NOT generate actions for normal questions.

Available functions:

- open_app
- click_node
- find_input
- type_text
- press_enter
- click_first_result

Examples:

User: "What is JavaScript?"
→
{
  "type": "response",
  "response": "JavaScript is..."
}

User: "Open YouTube"
→
{
  "type": "actions",
  "response": "Sure, I'll open YouTube.",
  "actions": [
    {
      "function": "open_app",
      "args": {
        "appName": "YouTube"
      }
    }
  ]
}

User: "Tell me a joke"
→
{
  "type": "response",
  "response": "..."
}

User: "Open Chrome and search React Native"
→
{
  "type": "actions",
  "response": "Sure, I'll search for React Native.",
  "actions": [...]
}
  before genertaing the resopne the make sure you analyis the frontend of the app before the response of the given pplatform.
`;
    const messages = [
      { role: "system", content: systemPrompt },
      ...(fileMessage ? [fileMessage] : []),
      { role: "user", content: usermessage },
    ];
    const chatCompletion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      response_format: { type: "json_object" },
    });
    const rawContent = chatCompletion.choices[0].message.content;
    return JSON.parse(rawContent);
  } catch (error) {
    console.error("Error processing message:", error);
    return {
      type: "chat",
      response: "Sorry, I encountered an internal error.",
    };
  }
}
module.exports = { message };
