// Узнать TELEGRAM_CHAT_ID: сначала напишите своему боту любое сообщение (или добавьте его в группу и напишите там),
// затем запустите:  node tools/telegram-chat-id.mjs <ТОКЕН_БОТА>
const token = process.argv[2]
if (!token) { console.log('Использование: node tools/telegram-chat-id.mjs <ТОКЕН_БОТА>'); process.exit(1) }
const r = await fetch(`https://api.telegram.org/bot${token}/getUpdates`).then((x) => x.json())
if (!r.ok) { console.log('Telegram ответил ошибкой:', r.description); process.exit(1) }
const chats = new Map()
for (const u of r.result) { const c = (u.message || u.channel_post || u.my_chat_member)?.chat; if (c) chats.set(c.id, c) }
if (!chats.size) console.log('Сообщений нет. Напишите боту что-нибудь (например /start) и запустите ещё раз.')
for (const c of chats.values()) console.log(`TELEGRAM_CHAT_ID=${c.id}   ← ${c.type}: ${c.title || [c.first_name, c.last_name].filter(Boolean).join(' ') || c.username}`)
