import ollama from 'ollama'
const TelegramBot = require('node-telegram-bot-api');

const token = Bun.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    if (msg.photo && msg.photo[0]) {
        let botMsg = await bot.sendMessage(msg.chat.id, 'thinking...', {
            reply_to_message_id: msg.message_id,
        });

        const imageStream = await bot.getFileStream(msg.photo[0].file_id);

        const chunks = [];
        imageStream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        imageStream.on('end', async () => {
            const buffer = Buffer.concat(chunks);
            const base64Image = buffer.toString('base64');

            try {
                const response = await ollama.chat({
                    model: 'moondream',
                    messages: [
                        { role: 'user', content: 'Describe the image', images: [base64Image] }
                    ],
                    stream: true
                });

                let res = '';
                let actualContent = '';
                let lastEdited = Date.now();

                for await (const part of response) {
                    res += part.message.content;

                    if (lastEdited + 200 < Date.now()) {
                        lastEdited = Date.now();
                        await bot.editMessageText(res, {
                            chat_id: botMsg.chat.id,
                            message_id: botMsg.message_id,
                        });
                        actualContent = res;
                    }
                }

                if (res != actualContent)
                    await bot.editMessageText(res, {
                        chat_id: botMsg.chat.id,
                        message_id: botMsg.message_id,
                    });
            } catch (ollamaError) {
                await bot.editMessageText('Error calling ollama', {
                    chat_id: botMsg.chat.id,
                    message_id: botMsg.message_id,
                });
            }
        });

        imageStream.on('error', async (err) => {
            await bot.editMessageText('Error while processing image', {
                chat_id: botMsg.chat.id,
                message_id: botMsg.message_id,
            });
        });

    }
});