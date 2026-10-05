/**
 * ВЕСЬ КОНТЕНТ САЙТА — ЗДЕСЬ.
 * Меняйте имя, тексты, цены, контакты и проекты в этом файле; компоненты трогать не нужно.
 * Медиа проектов лежат в src/assets/works/ (подключены ниже через import).
 */
import fadeCover from '../assets/works/fade-cover.webp'
import fadeMid from '../assets/works/fade-mid.webp'
import fadeEnd from '../assets/works/fade-end.webp'
import fadeMp4 from '../assets/works/fade.mp4'
import fadeWebm from '../assets/works/fade.webm'
import noireCover from '../assets/works/noire-cover.webp'
import noireMid from '../assets/works/noire-mid.webp'
import noireEnd from '../assets/works/noire-end.webp'
import noireMp4 from '../assets/works/noire.mp4'
import noireWebm from '../assets/works/noire.webm'
import ushCover from '../assets/works/ushakov-cover.webp'
import ushMid from '../assets/works/ushakov-mid.webp'
import ushEnd from '../assets/works/ushakov-end.webp'
import ushMp4 from '../assets/works/ushakov.mp4'
import ushWebm from '../assets/works/ushakov.webm'
import bjCover from '../assets/works/blackjack-cover.webp'
import bjMid from '../assets/works/blackjack-mid.webp'
import bjMp4 from '../assets/works/blackjack.mp4'
import bjWebm from '../assets/works/blackjack.webm'
import secCover from '../assets/works/section-cover.webp'
import secMid from '../assets/works/section-mid.webp'
import secMp4 from '../assets/works/section.mp4'
import secWebm from '../assets/works/section.webm'

// ───────────────────────── бренд и контакты
export const BRAND = {
  name: 'STATHAM',            // ← ваше имя или название студии
  suffix: 'studio',
  role: 'Web Design / Development / 3D / Interaction',
  city: 'Україна · remote',
  year: 2026,
}

/** null — кнопка покажет подсказку «ссылка появится скоро» вместо битой ссылки */
export const CONTACTS = {
  telegram: { label: '@statham1l', url: 'https://t.me/statham1l' as string | null },
  instagram: { label: '@statham_web', url: 'https://instagram.com/statham_web' as string | null },
  email: { label: 'hello@yourdomain.com', url: null as string | null }, // впишите 'mailto:you@domain.com' — пока null, email на сайте скрыт
}

/** Контакты, которые показываются на сайте: email скрыт, пока не задан его url */
export const CONTACT_KEYS = (['telegram', 'instagram', 'email'] as const).filter((k) => k !== 'email' || CONTACTS.email.url)

/**
 * Куда отправлять заявку. '/api/lead' — серверная функция (api/lead.js), которая пересылает заявку в ваш Telegram-чат.
 * Работает после деплоя на Vercel с переменными TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (инструкция — README.md).
 * Если отправить не удалось — форма предложит написать в Telegram напрямую, текст заявки копируется.
 */
export const FORM_ENDPOINT: string | null = '/api/lead'

// ───────────────────────── навигация и hero
export const NAV = [
  { id: '#works', label: 'Работы' },
  { id: '#services', label: 'Что делаю' },
  { id: '#process', label: 'Процесс' },
  { id: '#pricing', label: 'Цена' },
  { id: '#contact', label: 'Контакты' },
]

export const HERO = {
  kicker: 'WEB DESIGN / DEVELOPMENT / INTERACTION',
  title: ['Сайты, которые', 'выглядят дороже', 'вашего бизнеса.'],
  text: 'Создаю современные сайты с сильным визуалом, анимациями и продуманным пользовательским опытом.',
  primary: 'Посмотреть работы',
  secondary: 'Обсудить проект',
  status: 'Открыт для новых проектов',
}

// ───────────────────────── работы
export type Work = {
  id: string
  index: string
  title: string
  category: string
  year: number
  /** real — реальный проект; concept — заглушка-концепт: замените своим проектом */
  kind: 'real' | 'concept'
  tagline: string
  cover?: string
  video?: { mp4: string; webm: string }
  gallery?: string[]
  /** для концептов без картинок: цветовая тема обложки */
  concept?: 'restaurant' | 'beauty' | 'automotive'
  url?: string | null
  about: string
  task: string
  solution: string
  stack: string[]
  result: string[]
}

export const WORKS: Work[] = [
  {
    id: 'fade-district', index: '01', title: 'FADE DISTRICT', category: 'Barbershop', year: 2026, kind: 'real',
    tagline: '3D-ножницы, которые раскрываются вместе со скроллом.',
    cover: fadeMid, video: { mp4: fadeMp4, webm: fadeWebm }, gallery: [fadeCover, fadeEnd],
    url: 'https://claude.ai/artifact/4rQvYSrFzawgADkSU3mh9h',
    about: 'Премиальный сайт барбершопа в Киеве: украинский и английский, онлайн-запись, прайс и отзывы.',
    task: 'Сделать сайт, который с первых секунд передаёт характер мастерской и мягко ведёт к записи.',
    solution: 'Вступительная 3D-сцена с процедурными ножницами, 360°-просмотр инструментов, видео, перематываемое скроллом, и форма записи в один экран.',
    stack: ['React', 'TypeScript', 'Three.js / R3F', 'GSAP', 'Tailwind CSS'],
    result: ['Запись в 2 клика с любой карточки', 'Два языка через ползунок УКР/ENG', 'Адаптивные 3D-сцены для слабых устройств'],
  },
  {
    id: 'noire-coffee', index: '02', title: 'NOIRÉ COFFEE', category: 'Coffee shop', year: 2026, kind: 'real',
    tagline: 'Кинематографичная кофейня с 3D-чашкой.',
    cover: noireCover, video: { mp4: noireMp4, webm: noireWebm }, gallery: [noireMid, noireEnd],
    url: 'https://claude.ai/artifact/KR5uGdESKuZPuNQPWXskLt',
    about: 'Сайт specialty-кофейни: атмосфера, меню, ритуал приготовления и бронирование столика.',
    task: 'Передать вкус и атмосферу места до того, как гость откроет дверь.',
    solution: 'Тёплая антиква, крупные кадры, 3D-чашка, смоделированная в Blender, и переключатель языков.',
    stack: ['React', 'TypeScript', 'Blender → GLB', 'Three.js / R3F', 'GSAP'],
    result: ['Меню и бронь без лишних переходов', 'Узнаваемый визуальный образ бренда', 'Два языка'],
  },
  {
    id: 'restaurant', index: '03', title: 'MAISON NOIR', category: 'Restaurant', year: 2026, kind: 'concept', concept: 'restaurant',
    tagline: 'Концепт: ресторан, где сайт — это первое блюдо.',
    url: null,
    about: 'Концепт сайта для ресторана авторской кухни. Замените этот блок своим реальным проектом.',
    task: 'Показать кухню и атмосферу, упростить бронирование столика.',
    solution: 'Полноэкранные кадры блюд, меню-сезоны, бронь с выбором времени.',
    stack: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    result: ['Место для вашего результата', 'Например: +35% онлайн-броней', 'Например: время на сайте ×2'],
  },
  {
    id: 'beauty', index: '04', title: 'LUMEN', category: 'Beauty', year: 2026, kind: 'concept', concept: 'beauty',
    tagline: 'Концепт: студия красоты в мягком свете.',
    url: null,
    about: 'Концепт сайта beauty-студии. Замените этот блок своим реальным проектом.',
    task: 'Вызвать доверие и желание записаться с первого экрана.',
    solution: 'Мягкая палитра, крупные портреты, услуги с ценами и онлайн-запись к мастеру.',
    stack: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    result: ['Место для вашего результата', 'Например: запись без звонка', 'Например: портфолио мастеров'],
  },
  {
    id: 'automotive', index: '05', title: 'VELOCE', category: 'Automotive', year: 2026, kind: 'concept', concept: 'automotive',
    tagline: 'Концепт: детейлинг-центр, который ощущается как суперкар.',
    url: null,
    about: 'Концепт сайта автомобильного бизнеса. Замените этот блок своим реальным проектом.',
    task: 'Подчеркнуть премиальность услуг и вывести на заявку.',
    solution: 'Тёмная сцена со световыми линиями, пакеты услуг, до/после и калькулятор стоимости.',
    stack: ['React', 'TypeScript', 'Three.js / R3F', 'GSAP'],
    result: ['Место для вашего результата', 'Например: заявки с расчётом цены', 'Например: каталог услуг'],
  },
  {
    id: 'ushakov', index: '06', title: 'USHAKOV', category: 'Fintech / Education', year: 2026, kind: 'real',
    tagline: 'Торговый терминал × luxury fintech.',
    cover: ushCover, video: { mp4: ushMp4, webm: ushWebm }, gallery: [ushMid, ushEnd],
    url: 'https://claude.ai/artifact/SLTjqtoYjv7s3bS57Woq9f',
    about: 'Персональный бренд трейдера и образовательная платформа: обучение, аналитика, сообщество.',
    task: 'За 5–10 секунд объяснить, кто это, что здесь можно получить и куда нажать.',
    solution: '3D-ядро со свечным графиком, интерактивный дашборд, журнал сделок с графиками и заявка на обучение.',
    stack: ['React', 'TypeScript', 'Three.js / R3F', 'Framer Motion', 'GSAP'],
    result: ['Четыре понятных CTA с первого экрана', 'Честные демо-данные с пометкой', 'Мобильная нижняя навигация'],
  },
]

/** Дополнительные работы — компактная полоса под основными */
export const MORE_WORKS: Work[] = [
  {
    id: 'black-jack', index: '07', title: 'BLACK JACK', category: 'Barbershop', year: 2026, kind: 'real',
    tagline: 'Классический барбершоп с характером.',
    cover: bjCover, video: { mp4: bjMp4, webm: bjWebm }, gallery: [bjMid],
    url: 'https://claude.ai/artifact/C5xpUWzqrbGLhgeyVYAgwG',
    about: 'Сайт барбершопа: услуги, мастера, работы и онлайн-запись.',
    task: 'Брутальный, но дорогой образ без клише.',
    solution: 'Крупная гротескная типографика, 3D-бритва, рендеры инструментов из Blender.',
    stack: ['React', 'TypeScript', 'Three.js', 'Blender', 'GSAP'],
    result: ['Сильный первый экран', 'Портфолио работ', 'Запись к мастеру'],
  },
  {
    id: 'section', index: '08', title: 'SECTION', category: 'Barber atelier', year: 2026, kind: 'real',
    tagline: 'Кресло, которое поворачивается за курсором.',
    cover: secCover, video: { mp4: secMp4, webm: secWebm }, gallery: [secMid],
    url: 'https://claude.ai/artifact/9bt3zheyMwoVVY484VWNvG',
    about: 'Барбер-ателье с языком технического чертежа и интерактивным подбором стрижки.',
    task: 'Выделиться среди однотипных барбершопов.',
    solution: 'Видео-облёт кресла, управляемый мышью, «лаборатория фейда», 3D-барбер-пол.',
    stack: ['React', 'TypeScript', 'R3F', 'Blender', 'GSAP'],
    result: ['Интерактив вместо текста', 'Подбор стрижки → запись', 'Высокая скорость загрузки'],
  },
]

// ───────────────────────── услуги, процесс, цены, преимущества
export const SERVICES = [
  { n: '01', title: 'Website', text: 'Создание сайта с нуля — от концепции до запуска.', points: ['Структура и смыслы', 'Индивидуальный дизайн', 'Чистый код'] },
  { n: '02', title: 'Redesign', text: 'Полное визуальное обновление существующего сайта.', points: ['Аудит текущего сайта', 'Новый визуальный язык', 'Без потери контента'] },
  { n: '03', title: 'Interaction', text: 'Анимации, переходы и интерактивные элементы.', points: ['Scroll-анимации', 'Микро-взаимодействия', 'Плавность 60 fps'] },
  { n: '04', title: '3D / Visual', text: '3D-визуализация и нестандартные визуальные решения.', points: ['Three.js / WebGL', 'Модели и сцены', 'Лёгкие версии для телефона'] },
  { n: '05', title: 'Mobile', text: 'Адаптация под смартфоны и планшеты.', points: ['Отдельная мобильная композиция', 'Удобно пальцем', 'Быстрая загрузка'] },
  { n: '06', title: 'Launch', text: 'Подготовка и публикация готового сайта.', points: ['Домен и хостинг', 'SEO basics', 'Аналитика'] },
]

export const PROCESS = [
  { n: '01', title: 'Discover', text: 'Изучаю бизнес, аудиторию и задачу. Фиксирую цели сайта.', time: '1–2 дня' },
  { n: '02', title: 'Concept', text: 'Создаю структуру и визуальную концепцию — до любого кода.', time: '2–4 дня' },
  { n: '03', title: 'Design', text: 'Прорабатываю дизайн, интерфейс и анимации ключевых экранов.', time: '3–7 дней' },
  { n: '04', title: 'Development', text: 'Разрабатываю и адаптирую сайт под все устройства.', time: '5–14 дней' },
  { n: '05', title: 'Launch', text: 'Публикую сайт, проверяю скорость и все формы.', time: '1 день' },
  { n: '06', title: 'Support', text: 'При необходимости помогаю с развитием и новыми задачами.', time: 'по запросу' },
]

export const PRICING = {
  currency: 'грн',
  note: 'Точная стоимость рассчитывается после обсуждения задачи.',
  plans: [
    { name: 'Start', for: 'Для небольших проектов', from: 7000, items: ['Landing page', 'Адаптив', 'Базовые анимации', 'Форма контакта', 'Публикация'] },
    { name: 'Business', for: 'Для полноценного бизнеса', from: 15000, featured: true, items: ['Многостраничный сайт', 'Индивидуальный дизайн', 'Сложные анимации', 'Адаптив', 'Формы', 'SEO basics', 'Публикация'] },
    { name: 'Premium', for: 'Для проектов, которым нужен WOW-эффект', from: 25000, items: ['Индивидуальная концепция', 'Сложные анимации', '3D', 'Интерактив', 'Расширенный UX', 'Индивидуальные визуальные решения'] },
  ],
}

export const WHY = [
  'Не использую шаблонный подход',
  'Каждый сайт создаётся под конкретный бизнес',
  'Визуал + функциональность',
  'Одинаково хорошо на телефоне и компьютере',
  'Фокус на первом впечатлении и доверии клиента',
]

export const CTA = {
  title: ['Есть идея?', 'Давайте превратим', 'её в сайт.'],
  text: 'Расскажите о проекте — я предложу структуру, визуальное направление и решение.',
  button: 'Начать проект',
}

/** Бегущая строка между hero и работами: чередуются сплошной и контурный текст */
export const MARQUEE = ['Web design', 'Development', '3D / WebGL', 'Interaction', 'Motion', 'Launch']
