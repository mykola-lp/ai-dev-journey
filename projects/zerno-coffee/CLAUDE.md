# CLAUDE.md -- Зерно Coffee Shop Landing Page

## Brand
- Назва: Зерно
- Слоган: "Кожна чашка -- це історія"
- Тон: теплий, автентичний, крафтовий
- Аудиторія: міські професіонали 25-40, цінують якість
- Мова: українська
- Не використовувати: стокові фрази, корпоративний тон

## Design Direction
- Естетика: мінімалізм з теплими акцентами, натхненний скандинавськими кав'ярнями
- Палітра:
  --bg: #1a1410 (темно-коричневий)
  --bg2: #231c15 (фон карток)
  --cream: #f5e6d3 (кремовий, основний акцент)
  --gold: #c4960c (золотий, CTA)
  --text: #d4c5b0 (теплий сірий)
  --white: #faf5ef (теплий білий)
- Шрифти:
  Заголовки: Playfair Display 800 (serif, елегантний)
  Текст: Jost 300 (легкий, сучасний)
  Акценти: JetBrains Mono (ціни, адреса)
- Анімації: staggered reveal при scroll, subtle parallax на hero
- Без стокових фото. Використовувати CSS-арт і emoji.

## Tech
- Чистий HTML + CSS + мінімальний JS
- Mobile-first responsive
- CSS custom properties для всіх кольорів
- Деплой: Cloudflare Pages

## Sections
1. Hero -- повноекранний, назва + слоган + CTA "Переглянути меню"
2. Меню -- 3 категорії (Еспресо, Фільтр, Десерти), по 4 позиції
3. Історія -- "Про нас" в 2-3 абзаци, з фото-заглушкою
4. Розташування -- адреса, години роботи, мінімалістична карта
5. Footer -- Instagram, Telegram, копірайт

## Anti-slop Rules
<frontend_aesthetics>
Typography: use Playfair Display and Jost, NEVER Inter or Roboto.
Color: warm dark palette, no purple gradients.
Motion: staggered reveals on scroll, parallax on hero.
Background: subtle noise texture overlay, not solid colors.
</frontend_aesthetics>