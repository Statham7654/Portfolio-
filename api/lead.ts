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
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** @username → ссылка на профиль, чтобы ответить в один тап */
function contactLine(c: string) {
  const u = c.match(/^@?([a-zA-Z0-9_.]{4,32})$/)
  if (!u) return esc(c)
  return `${esc(c)} · <a href="https://t.me/${u[1]}">Telegram</a> · <a href="https://instagram.com/${u[1]}">Instagram</a>`
}

export async function POST(request: Request): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID
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

export function GET() {
  return json({ ok: false, error: 'method_not_allowed' }, 405)
}
