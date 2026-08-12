import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const message = async (usermessage) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.1-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: usermessage }
            ],
        });
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error(error);
        return 'Internal Server Error';
    }
};