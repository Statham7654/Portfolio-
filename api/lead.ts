/**
 * POST /api/lead — принимает заявку с сайта и пересылает её в Telegram-чат.
 *
 * Переменные окружения (Vercel → Project → Settings → Environment Variables, локально — файл .env.local):
 *   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
 *   TELEGRAM_CHAT_ID   — id чата, куда слать заявки (узнать: node tools/telegram-chat-id.mjs <токен>)
 * Токен живёт только на сервере — в код сайта и на GitHub он не попадает.
 */
type Lead = { name?: unknown; company?: unknown; contact?: unknown; message?: unknown; website?: unknown; page?: unknown }

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** @username → ссылка на профиль, чтобы ответить в один тап */
function contactLine(c: string) {
  const u = c.match(/^@?([a-zA-Z0-9_.]{4,32})$/)
  if (!u) return esc(c)
  return `${esc(c)} · <a href="https://t.me/${u[1]}">Telegram</a> · <a href="https://instagram.com/${u[1]}">Instagram</a>`
}

export async function POST(request: Request): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim(), chat = process.env.TELEGRAM_CHAT_ID?.trim()
  if (!token || !chat) return json({ ok: false, error: 'not_configured' }, 500)

  let d: Lead
  try { d = (await request.json()) as Lead } catch { return json({ ok: false, error: 'bad_json' }, 400) }

  // ловушка для спам-ботов: человек это поле не видит и не заполняет
  if (str(d.website, 200)) return json({ ok: true })

  const name = str(d.name, 100), company = str(d.company, 120), contact = str(d.contact, 120), message = str(d.message, 3000)
  if (name.length < 2 || contact.length < 3 || message.length < 6) return json({ ok: false, error: 'validation' }, 422)

  const page = str(d.page, 300)
  const when = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Kyiv', dateStyle: 'short', timeStyle: 'short' })
  const who = [`<b>Имя:</b> ${esc(name)}`, company && `<b>Компания:</b> ${esc(company)}`, `<b>Связь:</b> ${contactLine(contact)}`].filter(Boolean).join('\n')
  const text = [
    '🟢 <b>Новая заявка с сайта</b>',
    who,
    `<b>О проекте:</b>\n${esc(message)}`,
    `<i>${when}${page ? ` · ${esc(page)}` : ''}</i>`,
  ].join('\n\n')

  const api = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org'
  try {
    const r = await fetch(`${api}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    })
    const t = (await r.json().catch(() => null)) as { ok?: boolean; description?: string } | null
    if (!r.ok || !t?.ok) return json({ ok: false, error: 'telegram', detail: t?.description }, 502)
  } catch {
    return json({ ok: false, error: 'telegram_unreachable' }, 502)
  }
  return json({ ok: true })
}

/**
 * GET /api/lead — диагностика без отправки сообщений. Откройте https://ВАШ-САЙТ/api/lead в браузере:
 * покажет, заданы ли переменные, действителен ли токен и видит ли бот чат. Токен в ответ не выводится.
 */
export async function GET(): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim(), chat = process.env.TELEGRAM_CHAT_ID?.trim()
  const out: Record<string, unknown> = { token_set: !!token, chat_id_set: !!chat }
  if (!token || !chat) {
    out.ok = false
    out.hint = 'Не заданы переменные. Vercel → Project → Settings → Environment Variables: добавьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (галочка Production), затем Deployments → ⋯ → Redeploy.'
    return json(out, 200)
  }
  const api = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org'
  const call = async (m: string, body?: object) => {
    try {
      const r = await fetch(`${api}/bot${token}/${m}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body ?? {}) })
      return (await r.json()) as { ok: boolean; result?: Record<string, unknown>; description?: string }
    } catch { return { ok: false, description: 'telegram_unreachable' } }
  }
  const me = await call('getMe')
  if (!me.ok) {
    out.ok = false; out.bot = me.description
    out.hint = 'Токен бота неверный. Скопируйте токен заново у @BotFather (без пробелов и кавычек), обновите TELEGRAM_BOT_TOKEN и сделайте Redeploy.'
    return json(out, 200)
  }
  out.bot = '@' + me.result?.username
  const c = await call('getChat', { chat_id: chat })
  if (!c.ok) {
    out.ok = false; out.chat = c.description
    out.hint = `Бот ${out.bot} не видит чат ${chat}. Откройте ${out.bot} в Telegram и нажмите Start (или напишите /start), проверьте TELEGRAM_CHAT_ID (число, для групп начинается с -100), затем Redeploy.`
    return json(out, 200)
  }
  out.ok = true
  out.chat = c.result?.title || c.result?.first_name || c.result?.username || 'ok'
  out.hint = 'Всё настроено — заявки будут приходить в этот чат.'
  return json(out, 200)
}
