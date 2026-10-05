import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Send, AtSign, Camera } from 'lucide-react'
import { BRAND, CONTACTS, CONTACT_KEYS, FORM_ENDPOINT } from '../config/site'
import { Button, SectionHead, ContactLink } from '../components/ui'
import { EASE } from '../lib/motion'

type F = { name: string; company: string; contact: string; message: string; website: string }
const EMPTY: F = { name: '', company: '', contact: '', message: '', website: '' } // website — скрытое поле-ловушка для спам-ботов

const META = { telegram: { name: 'Telegram', Icon: Send }, instagram: { name: 'Instagram', Icon: Camera }, email: { name: 'Email', Icon: AtSign } }

/** Текст заявки — для копирования, если автоматическая отправка не сработала */
const leadText = (f: F) => `Заявка с сайта\nИмя: ${f.name}${f.company ? `\nКомпания: ${f.company}` : ''}\nСвязь: ${f.contact}\n\n${f.message}`

/**
 * Контакты: форма заявки. Отправка — на FORM_ENDPOINT (если задан в конфиге), иначе открывается письмо
 * на ваш email с готовым текстом, иначе — демо-подтверждение. Поля с «живыми» подписями.
 */
export default function Contact() {
  const [f, setF] = useState<F>(EMPTY)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const ok = f.name.trim().length > 1 && f.contact.trim().length > 2 && f.message.trim().length > 5
  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ok) return
    setState('sending')
    try {
      if (FORM_ENDPOINT) {
        // заявка уходит на сервер (api/lead.ts), он пересылает её в Telegram-чат; токен бота хранится только на сервере
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 12000)
        const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...f, page: location.href }), signal: ctrl.signal })
        clearTimeout(t)
        const j = await r.json().catch(() => null)
        if (!r.ok || !j?.ok) throw new Error(String(r.status))
      } else if (CONTACTS.email.url) {
        const body = `Имя: ${f.name}\nКомпания: ${f.company}\nСвязь: ${f.contact}\n\n${f.message}`
        location.href = `${CONTACTS.email.url}?subject=${encodeURIComponent('Новый проект — ' + f.name)}&body=${encodeURIComponent(body)}`
      } else await new Promise((r) => setTimeout(r, 700))
      setState('sent')
    } catch { setState('error') }
  }

  const field = 'peer w-full border-b border-white/15 bg-transparent pb-3 pt-7 text-[18px] outline-none transition-colors placeholder:text-transparent focus:border-signal sm:text-[20px]'
  const lab = 'mono pointer-events-none absolute left-0 top-7 text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-signal peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px]'

  return (
    <section id="contact" className="relative border-t border-white/[0.06] py-28 sm:py-40">
      <div className="wrap grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <SectionHead index="07" label="Контакты" title={['Начнём?']}>
            <p className="mt-8 max-w-sm text-[16px] leading-relaxed text-muted">Отвечаю в течение дня. Опишите задачу — даже в двух предложениях — и я предложу решение и примерный бюджет.</p>
          </SectionHead>
          <ul className="mt-14 grid gap-1 border-t border-white/[0.08]">
            {CONTACT_KEYS.map((k) => ({ k, ...META[k] })).map(({ k, name, Icon }) => (
              <li key={k}>
                <ContactLink k={k} className="group flex w-full items-center justify-between border-b border-white/[0.08] py-5 text-left">
                  <span className="flex items-center gap-4"><Icon size={18} className="text-muted transition-colors group-hover:text-signal" /><span className="text-[18px]">{name}</span></span>
                  <span className="mono text-dim transition-colors group-hover:text-ink">{CONTACTS[k].label}</span>
                </ContactLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-[28px] border border-white/[0.08] bg-coal p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {state === 'sent' ? (
              <motion.div key="ok" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="grid min-h-[460px] place-items-center text-center">
                <div>
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-signal text-void"><Check size={26} /></span>
                  <h3 className="display mt-8 text-[40px]">Заявка отправлена</h3>
                  <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">Спасибо, {f.name.split(' ')[0]}! Свяжусь с вами через {f.contact} в течение дня.{!FORM_ENDPOINT && !CONTACTS.email.url && <span className="mt-2 block text-dim">(Демо-режим: подключите FORM_ENDPOINT или email в config/site.ts.)</span>}</p>
                  <button onClick={() => { setF(EMPTY); setState('idle') }} className="mono mt-8 text-muted hover:text-ink">Отправить ещё одну</button>
                </div>
              </motion.div>
            ) : state === 'error' ? (
              <motion.div key="err" role="alert" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="grid min-h-[460px] place-items-center text-center">
                <div className="max-w-sm">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/15 text-signal"><Send size={24} /></span>
                  <h3 className="display mt-8 text-[34px] sm:text-[40px]">Напишите мне в Telegram</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted">Автоматическая отправка сейчас не сработала. Нажмите кнопку — текст заявки скопируется, останется вставить его в чат.</p>
                  <div className="mt-8 grid gap-3" onClickCapture={() => { navigator.clipboard?.writeText(leadText(f)).catch(() => {}) }}>
                    <ContactLink k="telegram" className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-signal px-7 text-[15px] font-medium text-void"><Send size={16} />Открыть {CONTACTS.telegram.label}</ContactLink>
                  </div>
                  <button onClick={() => setState('idle')} className="mono mt-6 text-muted hover:text-ink">Вернуться к форме</button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-8" noValidate>
                <input value={f.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />
                <div className="grid gap-8 sm:grid-cols-2">
                  <label className="relative block"><input value={f.name} onChange={set('name')} placeholder="Имя" autoComplete="name" required className={field} /><span className={lab}>Имя *</span></label>
                  <label className="relative block"><input value={f.company} onChange={set('company')} placeholder="Компания" autoComplete="organization" className={field} /><span className={lab}>Компания</span></label>
                </div>
                <label className="relative block"><input value={f.contact} onChange={set('contact')} placeholder="Telegram / Instagram" required className={field} /><span className={lab}>Telegram / Instagram *</span></label>
                <label className="relative block"><textarea value={f.message} onChange={set('message')} placeholder="Расскажите о проекте" rows={4} required className={`${field} resize-none`} /><span className={lab}>Расскажите о проекте *</span></label>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="mono text-[10px] text-dim">* обязательные поля</p>
                  <Button type="submit" variant="signal" disabled={!ok || state === 'sending'}>{state === 'sending' ? 'Отправляю…' : 'Отправить заявку'}</Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
      <span className="sr-only">{BRAND.name}</span>
    </section>
  )
}
