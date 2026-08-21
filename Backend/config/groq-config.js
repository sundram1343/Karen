const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const message = async (usermessage) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            model:  "openai/gpt-oss-20b",
            messages: Array.isArray(usermessage)
            ? usermessage
            : [{ role: "user", content: usermessage }],
        });
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error(error);
        return 'Internal Server Error';
    }
};
module.exports = { message };