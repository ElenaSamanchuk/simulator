# 🚀 Инструкции по развертыванию React игры на GitHub Pages

## ⚡ Быстрый старт

Проект уже настроен для автоматического развертывания! Просто следуйте этим шагам:

### 1. **Подготовка репозитория**
```bash
# Форкните репозиторий или создайте свой
git clone https://github.com/ElenaSamanchuk/simulator.git
cd simulator

# Установите зависимости
npm install
```

### 2. **Настройка GitHub Pages**
1. Перейдите в **Settings** → **Pages** вашего репозитория
2. В разделе **"Source"** выберите **"GitHub Actions"**
3. Нажмите **"Save"**

### 3. **Развертывание**
```bash
# Добавьте изменения
git add .
git commit -m "Deploy React game to GitHub Pages"

# Пушьте в main ветку
git push origin main
```

**Готово!** GitHub Actions автоматически:
- ✅ Соберет React проект
- ✅ Настроит правильные пути
- ✅ Развернет на GitHub Pages

## 🌐 Доступ к игре

После успешного развертывания игра будет доступна по адресу:
```
https://ElenaSamanchuk.github.io/simulator/
```

## 🔧 Технические детали

### Конфигурация Vite (vite.config.ts)
```typescript
export default defineConfig({
  base: '/simulator/', // Базовый путь для GitHub Pages
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### GitHub Actions Workflow (.github/workflows/deploy.yml)
- Автоматическая сборка при push в main/master
- Использует Node.js 18
- Развертывает в папку `dist`

### Package.json скрипты
```json
{
  "scripts": {
    "dev": "vite",           // Локальная разработка
    "build": "tsc && vite build", // Сборка для продакшена
    "preview": "vite preview"      // Предварительный просмотр
  }
}
```

## 🛠 Локальная разработка

```bash
# Запуск dev сервера (обычно http://localhost:3000)
npm run dev

# Сборка для продакшена
npm run build

# Просмотр собранной версии
npm run preview
```

## ⚠️ Устранение проблем

### Проблема: Игра не загружается (404)
**Причина:** Неправильный базовый путь
**Решение:**
1. Проверьте `base: '/simulator/'` в `vite.config.ts`
2. Убедитесь, что репозиторий называется `simulator`
3. Если репозиторий имеет другое название, измените базовый путь

### Проблема: GitHub Actions не запускается
**Решение:**
1. Убедитесь, что в настройках Pages выбран "GitHub Actions"
2. Проверьте файл `.github/workflows/deploy.yml`
3. Убедитесь, что пушите в ветку `main` или `master`

### Проблема: Стили не применяются
**Решение:**
1. Проверьте импорт CSS в `App.tsx`
2. Убедитесь, что Tailwind CSS правильно настроен
3. Проверьте `tailwind.config.js` конфигурацию

## 🎯 Особенности игры

### Адаптивность
- ✅ Полностью оптимизирована для мобильных устройств
- ✅ Swipe жесты работают на touch устройствах
- ✅ Responsive дизайн для всех размеров экранов

### Технологии
- **React 18** с TypeScript
- **Tailwind CSS** для стилизации  
- **Motion** для анимаций
- **Radix UI** для компонентов
- **Vite** для быстрой сборки

### Функциональность
- 🎮 40+ уникальных решений
- 🎯 Система достижений
- 🎵 Синтезированные звуковые эффекты
- 📊 Детальная статистика игры
- 🌍 Международные отношения
- ⚡ Случайные события

## 🎨 Кастомизация

### Изменение названия проекта
1. Измените `base` в `vite.config.ts`
2. Обновите `homepage` в `package.json`
3. Обновите URL в README.md

### Добавление аналитики
Добавьте код Google Analytics в `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 📱 PWA Support

Игра готова для установки как прогрессивное веб-приложение:
- ✅ Правильные мета-теги в `index.html`
- ✅ Viewport настройки для мобильных устройств
- ✅ Фавиконы в папке `public/`

## 🔄 Обновления

Для обновления игры:
```bash
# Получите последние изменения
git pull origin main

# Установите новые зависимости (если есть)
npm install

# Пушьте изменения (автоматически соберется и развернется)
git push origin main
```

## 📞 Поддержка

Если что-то не работает:
1. 🔍 Проверьте **Actions** вкладку в GitHub для логов сборки
2. 🌐 Откройте браузер Developer Tools для ошибок JavaScript
3. 📧 Создайте Issue в репозитории с подробным описанием проблемы

---

**🎉 Поздравляем!** Ваша игра готова к запуску на GitHub Pages!