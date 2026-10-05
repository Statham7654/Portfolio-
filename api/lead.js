/**
 * /api/lead — серверная функция Vercel (обычный JavaScript, без сборки — так надёжнее всего).
 *   POST — принимает заявку с сайта и пересылает её в Telegram-чат.
 *   GET  — диагностика без отправки сообщений: откройте https://ВАШ-САЙТ/api/lead в браузере.
 *
 * Переменные окружения (Vercel → Project → Settings → Environment Variables, локально — .env.local):
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   — id чата (узнать: node tools/telegram-chat-id.mjs <токен>)
 * Токен живёт только на сервере — в код сайта и на GitHub он не попадает.
 */

const send = (res, status, body) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body, null, 2))
}
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const env = () => ({
  token: process.env.TELEGRAM_BOT_TOKEN?.trim(),
  chat: process.env.TELEGRAM_CHAT_ID?.trim(),
  api: process.env.TELEGRAM_API_BASE || 'https://api.telegram.org',
})

/** Вызов Telegram Bot API; при сетевой ошибке — { ok: false } */
async function tg(method, payload) {
  const { token, api } = env()
  try {
    const r = await fetch(`${api}/bot${token}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload ?? {}) })
    return await r.json()
  } catch {
    return { ok: false, description: 'telegram_unreachable' }
  }
}

/** Тело запроса: на Vercel уже разобрано в req.body, в dev-сервере — читаем поток */
async function readBody(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  let raw = ''
  for await (const c of req) raw += c
  return JSON.parse(raw || '{}')
}

/** @username → ссылки на профиль, чтобы ответить в один тап */
function contactLine(c) {
  const u = c.match(/^@?([a-zA-Z0-9_.]{4,32})$/)
  if (!u) return esc(c)
  return `${esc(c)} · <a href="https://t.me/${u[1]}">Telegram</a> · <a href="https://instagram.com/${u[1]}">Instagram</a>`
}

async function post(req, res) {
  const { token, chat } = env()
  if (!token || !chat) return send(res, 500, { ok: false, error: 'not_configured' })

  let d
  try { d = (await readBody(req)) || {} } catch { return send(res, 400, { ok: false, error: 'bad_json' }) }

  // ловушка для спам-ботов: человек это поле не видит и не заполняет
  if (str(d.website, 200)) return send(res, 200, { ok: true })

  const name = str(d.name, 100), company = str(d.company, 120), contact = str(d.contact, 120), message = str(d.message, 3000)
  if (name.length < 2 || contact.length < 3 || message.length < 6) return send(res, 422, { ok: false, error: 'validation' })

  const page = str(d.page, 300)
  const when = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Kyiv', dateStyle: 'short', timeStyle: 'short' })
  const who = [`<b>Имя:</b> ${esc(name)}`, company && `<b>Компания:</b> ${esc(company)}`, `<b>Связь:</b> ${contactLine(contact)}`].filter(Boolean).join('\n')
  const text = [
    '🟢 <b>Новая заявка с сайта</b>',
    who,
    `<b>О проекте:</b>\n${esc(message)}`,
    `<i>${when}${page ? ` · ${esc(page)}` : ''}</i>`,
  ].join('\n\n')

  const t = await tg('sendMessage', { chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true })
  if (!t?.ok) return send(res, 502, { ok: false, error: 'telegram', detail: t?.description })
  return send(res, 200, { ok: true })
}

async function diagnose(res) {
  const { token, chat } = env()
  const out = { token_set: !!token, chat_id_set: !!chat }
  if (!token || !chat) {
    return send(res, 200, { ...out, ok: false, hint: 'Не заданы переменные. Vercel → Project → Settings → Environment Variables: добавьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (галочка Production), затем Deployments → ⋯ → Redeploy.' })
  }
  const me = await tg('getMe')
  if (!me?.ok) {
    return send(res, 200, { ...out, ok: false, bot: me?.description, hint: 'Токен бота неверный. Скопируйте токен заново у @BotFather (без пробелов и кавычек), обновите TELEGRAM_BOT_TOKEN и сделайте Redeploy.' })
  }
  const bot = '@' + me.result?.username
  const c = await tg('getChat', { chat_id: chat })
  if (!c?.ok) {
    return send(res, 200, { ...out, ok: false, bot, chat: c?.description, hint: `Бот ${bot} не видит чат ${chat}. Откройте ${bot} в Telegram и нажмите Start (или напишите /start), проверьте TELEGRAM_CHAT_ID (число, для групп начинается с -100), затем Redeploy.` })
  }
  return send(res, 200, { ...out, ok: true, bot, chat: c.result?.title || c.result?.first_name || c.result?.username || 'ok', hint: 'Всё настроено — заявки будут приходить в этот чат.' })
}

export default async function handler(req, res) {
  if (req.method === 'POST') return post(req, res)
  if (req.method === 'GET') return diagnose(res)
  res.setHeader('Allow', 'GET, POST')
  return send(res, 405, { ok: false, error: 'method_not_allowed' })
}
