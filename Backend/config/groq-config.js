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
  return { role: 'user', content };
}
async function message(usermessage, filepath) {
  try {
    const fileMessage = filepath ? await buildMessageFromFile(filepath) : null;
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: usermessage },
      ...(fileMessage ? [fileMessage] : [])
    ];
    const chatCompletion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return 'Internal Server Error';
  }
}
module.exports = { message };