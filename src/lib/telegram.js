import { getAllData } from './localStorage';

let botToken = '';
let chatId = '';

export const configureTelegram = (token, chat) => {
  botToken = token;
  chatId = chat;
  localStorage.setItem('telegram_config', JSON.stringify({ botToken: token, chatId: chat }));
};

export const getTelegramConfig = () => {
  const config = localStorage.getItem('telegram_config');
  if (config) {
    const parsed = JSON.parse(config);
    botToken = parsed.botToken;
    chatId = parsed.chatId;
    return parsed;
  }
  return null;
};

export const sendBackupToTelegram = async () => {
  if (!botToken || !chatId) {
    throw new Error('Telegram not configured. Please set bot token and chat ID first.');
  }

  const data = getAllData();
  const message = `
🔐 Shortlink Manager Backup
📅 Date: ${new Date().toLocaleString()}

📊 Statistics:
- Total Shortlinks: ${data.shortlinks.length}
- Total Shortlists: ${data.shortlists.length}
- Total Clicks: ${data.shortlinks.reduce((sum, s) => sum + (s.clicks || 0), 0)}

📦 Data exported successfully!
  `.trim();

  const dataFile = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('document', dataFile, `backup_${Date.now()}.json`);
  formData.append('caption', message);

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
    method: 'POST',
    body: formData
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.description || 'Failed to send backup to Telegram');
  }

  return result;
};

export const sendNotification = async (message) => {
  if (!botToken || !chatId) {
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
};

export const setupAutoBackup = (intervalHours = 24) => {
  const interval = intervalHours * 60 * 60 * 1000;

  setInterval(async () => {
    try {
      await sendBackupToTelegram();
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  }, interval);
};
