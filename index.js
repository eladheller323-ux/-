const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// המפתח שלך
const genAI = new GoogleGenerativeAI("AIzaSyB9zO9M_B0y4ghbUamVx62UfswJSQY7dtk");
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "אתה Gemini-Bot, העוזר של אלעד. תענה בסלנג, תהיה ציני ומצחיק."
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/google-chrome-stable' // חשוב ל-Render
    }
});

client.on('qr', (qr) => {
    // ה-QR יופיע בתוך ה-Logs של Render!
    console.log('סרוק את ה-QR קוד שמופיע כאן:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('הבוט של אלעד מחובר לוואטסאפ! 🔥');
});

client.on('message', async msg => {
    // הבוט יענה רק לך (המספר שמסתיים ב-274)
    if (msg.from === '972509109274@c.us') {
        try {
            const result = await model.generateContent(msg.body);
            const response = await result.response;
            msg.reply(response.text());
        } catch (e) {
            console.log("Error:", e);
        }
    }
});

client.initialize();
