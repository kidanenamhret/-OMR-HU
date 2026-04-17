const express = require('express');
const router = express.Router();
const TelegramBot = require('node-telegram-bot-api');

// Helper to send telegram message
const sendTelegram = async (message) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('Telegram credentials not configured');
    return false;
  }

  try {
    const bot = new TelegramBot(token, { polling: false });
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    return true;
  } catch (err) {
    console.error('Telegram error:', err.message);
    return false;
  }
};

// @route   POST api/notifications/broadcast
// @desc    Send a custom broadcast to the fellowship Group
router.post('/broadcast', async (req, res) => {
  const { message, type } = req.body;
  const emoji = type === 'prayer' ? '🙏' : type === 'event' ? '📅' : '📢';
  const header = `*Fellowship Alert* ${emoji}\n\n`;
  
  const success = await sendTelegram(header + message);
  if (success) {
    res.json({ msg: 'Broadcast sent successfully' });
  } else {
    res.status(500).json({ msg: 'Failed to send broadcast. Check configuration.' });
  }
});

module.exports = router;
