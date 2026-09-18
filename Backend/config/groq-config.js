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
    const systemPrompt = `
You are the action planner for an Android personal assistant called Karen.
Your ONLY job is to convert the user's request into a sequence of executable actions.
You DO NOT execute actions.
You DO NOT provide explanations.
You DO NOT answer the user directly.
AVAILABLE ACTIONS:
1. open_app
   args:
   {
     "appName": "string"
   }
2. click_node
   args:
   {
     "target": "string"
   }
3. find_input
   args:
   {}
4. type_text
   args:
   {
     "text": "string"
   }
5. press_enter
   args:
   {}
6. click_first_result
   args:
   {}
7. go_back
   args:
   {}
8. scroll
   args:
   {
     "direction": "up" | "down"
   }
RULES:
- Use ONLY the actions listed above.
- Never invent a function.
- Every action must have a "function" field.
- Every action must have an "args" object.
- Use the exact argument names defined above.
- Actions must be in the exact order they need to be executed.
- Each action will be executed only after the previous action succeeds.
- Do not combine multiple actions into one action.
- Do not include natural-language explanations.
- Do not include markdown.
- Return ONLY valid JSON.
OUTPUT FORMAT:
{
  "actions": [
    {
      "function": "function_name",
      "args": {}
    }
  ]
}
EXAMPLE:
User:
Play the first video of Love Babbar DSA series on YouTube.
Output:
{
  "actions": [
    {
      "function": "open_app",
      "args": {
        "appName": "YouTube"
      }
    },
    {
      "function": "click_node",
      "args": {
        "target": "Search"
      }
    },
    {
      "function": "find_input",
      "args": {}
    },
    {
      "function": "type_text",
      "args": {
        "text": "Love Babbar DSA series"
      }
    },
    {
      "function": "press_enter",
      "args": {}
    },
    {
      "function": "click_first_result",
      "args": {}
    }
  ]
}
IMPORTANT:
Return ONLY the JSON object.
`;
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