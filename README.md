# moondream2 Telegram integration

Send a picture to a Telegram bot and get it described by moondream2 via ollama.

## Installation

```
git clone git@github.com:ssebastianoo/moondream2-telegram.git
cd moondream2-telegram
bun i # or npm i
cp .example.env .env
```

Set `TELEGRAM_TOKEN` in `.env` to your Telegram bot token.

Pull the model

```
ollama pull moondream
```

Run the bot

```
bun main.js
```
![output](https://github.com/user-attachments/assets/40fd7a57-7e4d-48b9-8639-f8f9256fe4f3)
