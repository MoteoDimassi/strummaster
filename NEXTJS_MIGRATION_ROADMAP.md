# План миграции StrumMaster на Next.js (App Router)

**Роль:** Senior Frontend Architect
**Цель:** Перенос SPA приложения (Vite/React) на гибридную архитектуру Next.js для обеспечения SEO-оптимизации, производительности и масштабируемости.

---

## 1. Архитектурный обзор

Текущее приложение работает по модели **CSR (Client Side Rendering)**: браузер загружает пустой HTML и JS-бандл, который затем рендерит интерфейс. Это критически ограничивает SEO, так как поисковые роботы видят пустую страницу до выполнения JS.

**Новая архитектура (Next.js App Router):**

- **Server Components (RSC):** По умолчанию все компоненты рендерятся на сервере. Это идеально для статических страниц (Блог, Лендинг, Уроки), так как HTML генерируется заранее или по запросу.
- **Client Components:** Интерактивные элементы (Тюнер, Метроном, Плеер), требующие доступа к браузерным API (`window`, `AudioContext`, `Microphone`), будут явно помечены директивой `'use client'`.
- **SSG (Static Site Generation):** Страницы блога и курсов будут генерироваться во время сборки на основе данных из Strapi.

---

## 2. Подготовительный этап

### Инициализация

1.  Создать новый проект рядом с текущим (или в новой ветке):
    ```bash
    npx create-next-app@latest strummaster-next --typescript --tailwind --eslint
    ```
2.  Перенести зависимости из `package.json` (Redux Toolkit, Framer Motion, Lucide React, etc.).
3.  Настроить алиасы в `tsconfig.json` (совпадающие с текущими `@/*`).

### Структура папок (App Router)

```
src/
  app/                 # Роутинг (вместо react-router-dom)
    layout.tsx         # Корневой лейаут (Header, Footer)
    page.tsx           # Главная страница
    blog/
      page.tsx         # Список статей
      [slug]/
        page.tsx       # Страница статьи (SSG)
    tuner/
      page.tsx         # Страница тюнера
  components/          # Перенесенные UI компоненты
  features/            # Перенесенная бизнес-логика
  lib/                 # Утилиты
  store/               # Redux store
```

---

## 3. Стратегия миграции интерактивных инструментов

Все музыкальные инструменты используют Web Audio API, который недоступен на сервере.

### Общие правила для инструментов:

1.  **Директива `'use client'`:** Обязательна в начале файла любого компонента, использующего хуки (`useState`, `useEffect`) или браузерные API.
2.  **Динамический импорт:** Чтобы избежать ошибок гидратации ("ReferenceError: window is not defined"), тяжелые компоненты следует импортировать с отключенным SSR:
    ```typescript
    const Tuner = dynamic(() => import("@/features/tuner/components/Tuner"), {
      ssr: false,
    });
    ```

### Детальный план по фичам:

#### А. Тюнер (`src/features/tuner`)

- **Проблема:** Использует `navigator.mediaDevices.getUserMedia`.
- **Решение:**
  - Весь `TunerPage` должен быть Client Component.
  - Логику инициализации микрофона обернуть в `useEffect`.
  - Обработать состояние "Загрузка" пока компонент монтируется на клиенте.

#### Б. Метроном (`src/features/metronome`)

- **Проблема:** Использует `AudioContext` для точного тайминга и Web Worker.
- **Решение:**
  - Web Worker нужно вынести в папку `public/workers` или использовать лоадеры Next.js.
  - Инициализация `AudioContext` строго по клику пользователя (политика автовоспроизведения браузеров).

#### В. Тренажеры слуха и аккордов (`src/features/chord-trainer`, `harmonic-ear-trainer`)

- **Проблема:** Генерация звука "на лету".
- **Решение:**
  - Компоненты `Piano`, `Staff`, `Stave` — чистые UI компоненты, могут быть серверными (если не интерактивны) или клиентскими.
  - Сервисы `audioEngine.ts` должны инициализироваться только внутри `useEffect` или обработчиков событий.

---

## 4. Интеграция со Strapi и SEO

### Отказ от клиентских запросов

Вместо `useEffect(() => fetch(...))` используем асинхронные серверные компоненты:

```typescript
// src/app/blog/page.tsx
async function getPosts() {
  const res = await fetch("https://api.strummaster.com/posts", {
    cache: "force-cache",
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
```

### SSG для статей (Static Site Generation)

Для генерации статических страниц каждой статьи используем `generateStaticParams`:

```typescript
// src/app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

Это заставит Next.js создать HTML файлы для всех статей во время билда.

### Metadata API

Удаляем `react-helmet-async`. В каждом `page.tsx` или `layout.tsx` экспортируем объект `metadata`:

```typescript
export const metadata: Metadata = {
  title: 'Настройка гитары онлайн | StrumMaster',
  description: 'Точный тюнер для гитары через микрофон...',
  openGraph: { ... }
};
```

---

## 5. Пошаговый план реализации (Roadmap)

### Шаг 1: Фундамент (1-2 дня)

- [ ] Инициализировать проект Next.js.
- [ ] Настроить Tailwind CSS и шрифты (`next/font/google`).
- [ ] Перенести UI Kit (`src/components/ui`) и проверить работоспособность Shadcn UI.
- [ ] Настроить Redux (использовать `ReduxProvider` только внутри клиентского компонента-обертки).

### Шаг 2: Миграция статики и лейаутов (2-3 дня)

- [ ] Создать `RootLayout` с Header и Footer.
- [ ] Перенести `LandingPage` (разбить на секции, оптимизировать картинки через `next/image`).
- [ ] Реализовать страницы "О нас", "Контакты".
- **DoD:** Сайт запускается, навигация работает, статические страницы загружаются мгновенно.

### Шаг 3: Интеграция Strapi (Блог и Курсы) (3-4 дня)

- [ ] Настроить клиент Strapi.
- [ ] Реализовать `app/blog/page.tsx` (список).
- [ ] Реализовать `app/blog/[slug]/page.tsx` (статья) с SSG.
- [ ] Настроить ревалидацию данных (ISR) для обновления контента без пересборки.
- **DoD:** Статьи доступны по прямым ссылкам, исходный код страницы содержит текст статьи (проверка View Source).

### Шаг 4: Адаптация сложных инструментов (5-7 дней)

- [ ] Перенести Тюнер (с `ssr: false`).
- [ ] Перенести Метроном.
- [ ] Перенести Тренажеры.
- [ ] Протестировать работу AudioContext на мобильных устройствах.
- **DoD:** Все инструменты работают идентично текущей версии, нет ошибок гидратации в консоли.

---

## 6. Оптимизация и Деплой

### Dockerfile для Next.js (Standalone mode)

Использовать режим `output: 'standalone'` в `next.config.js` для уменьшения размера образа.

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Чек-лист перед релизом:

1.  [ ] Прогнать Lighthouse (цель: SEO > 90, Performance > 90).
2.  [ ] Проверить `robots.txt` и `sitemap.xml` (генерируются автоматически).
3.  [ ] Настроить Canonical URL.
