# STATHAM studio — портфолио веб-разработчика

Премиальный сайт-портфолио: liquid-chrome 3D в hero, кинетическая строка, работы с hover-видео и полноэкранными кейсами, услуги, процесс, пакеты цен и форма заявки.

**Стек:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion (motion) · GSAP ScrollTrigger · Lenis · React Three Fiber / Three.js · Lucide.

## Запуск

```bash
npm install
npm run dev       # разработка
npm run build     # продакшн-сборка в dist/
npm run preview   # просмотр сборки
```

## Где менять контент

Все тексты, цены, контакты, проекты и ссылки — в `src/config/site.ts`.
Медиа проектов — в `src/assets/works/` (`.webp` обложки, `.mp4/.webm` hover-видео).
Подробности — в `CLAUDE.md`.

## Заявки в Telegram

Форма отправляет заявку на `/api/lead` (файл `api/lead.ts`), а сервер пересылает её в ваш Telegram-чат через бота.
Токен бота хранится только в настройках сервера — в коде сайта и на GitHub его нет.

1. **Создайте бота.** В Telegram откройте [@BotFather](https://t.me/BotFather) → `/newbot` → придумайте имя → получите токен вида `123456789:AA...`.
2. **Напишите своему боту** любое сообщение (например `/start`) — иначе бот не сможет писать вам первым.
   Хотите получать заявки в группу — добавьте бота в группу и напишите там что-нибудь.
3. **Узнайте id чата:** `node tools/telegram-chat-id.mjs <ТОКЕН>` — скрипт выведет `TELEGRAM_CHAT_ID=...`.
4. **Опубликуйте на Vercel:** [vercel.com](https://vercel.com) → Add New → Project → импортируйте этот репозиторий.
   В Settings → Environment Variables добавьте `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` → Redeploy.
5. Готово: каждая заявка приходит в чат с именем, компанией, контактом (со ссылками, чтобы ответить в один тап) и текстом.

### Если заявки не приходят

Откройте в браузере **`https://ВАШ-САЙТ.vercel.app/api/lead`** — страница покажет, что не так (сообщение при этом не отправляется):

| Что видно | Что сделать |
|---|---|
| `"token_set": false` или `"chat_id_set": false` | Добавьте переменные в Vercel → Settings → Environment Variables (Production) → Redeploy |
| `"bot": "Unauthorized"` | Токен неверный — скопируйте заново у @BotFather, обновите, Redeploy |
| `"chat": "Bad Request: chat not found"` | Нажмите Start в своём боте, проверьте TELEGRAM_CHAT_ID, Redeploy |
| `"ok": true` | Всё настроено |
| Страница 404 | Функция не задеплоилась: в Vercel проверьте, что Root Directory — корень репозитория |

На экране ошибки формы внизу мелким шрифтом есть «код: …» — он показывает ту же причину.

Локально: скопируйте `.env.example` в `.env.local`, впишите токен и id, запустите `npm run dev`.

Если отправка не удалась (нет сети, бот не настроен), форма не теряет заявку: показывает кнопку «Открыть @statham1l»
и копирует текст заявки, чтобы клиент вставил его в чат.
