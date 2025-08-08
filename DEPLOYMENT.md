# Инструкции по развертыванию на GitHub Pages

## Автоматическое развертывание

Проект настроен для автоматического развертывания на GitHub Pages при каждом push в ветку `main` или `master`.

### Шаги для настройки:

1. **Форкните или клонируйте репозиторий**
   ```bash
   git clone https://github.com/ElenaSamanchuk/simulator.git
   cd simulator
   ```

2. **Настройте GitHub Pages в настройках репозитория:**
   - Перейдите в Settings → Pages
   - В разделе "Source" выберите "GitHub Actions"
   - Сохраните настройки

3. **Пушьте изменения в main/master:**
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

4. **GitHub Actions автоматически:**
   - Установит зависимости
   - Соберет проект с правильным базовым путем
   - Развернет на GitHub Pages

## URL проекта

После развертывания игра будет доступна по адресу:
```
https://ElenaSamanchuk.github.io/simulator/
```

## Ручное развертывание (альтернатива)

Если вы предпочитаете ручное развертывание:

1. **Установите gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Соберите и разверните:**
   ```bash
   npm run build
   npm run deploy
   ```

## Настройка базового пути

Базовый путь настроен в `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/simulator/',
  // ... другие настройки
})
```

Если вы изменили название репозитория, обновите:
- `base` в `vite.config.ts`
- `homepage` в `package.json`
- URL в README.md и других файлах

## Проверка развертывания

1. **Статус сборки:** Проверьте вкладку Actions в GitHub
2. **Доступность:** Откройте https://ВАШЕ_ИМЯ.github.io/simulator/
3. **Функциональность:** Убедитесь, что все функции работают

## Устранение проблем

### Проблема: 404 ошибка при загрузке
**Решение:** Проверьте корректность базового пути в конфигурации

### Проблема: Ресурсы не загружаются
**Решение:** Убедитесь, что все импорты используют относительные пути

### Проблема: GitHub Actions не запускается
**Решение:** 
1. Проверьте настройки Pages (должен быть выбран GitHub Actions)
2. Убедитесь, что workflow файл находится в `.github/workflows/`
3. Проверьте права доступа репозитория

## Конфигурация окружения

### Переменные среды
Если нужны переменные среды, создайте `.env` файл:
```
VITE_APP_TITLE=ГОСУДАРСТВО
VITE_API_URL=https://api.example.com
```

### Secrets для GitHub Actions
Для приватных API ключей используйте GitHub Secrets:
1. Settings → Secrets and variables → Actions
2. Добавьте необходимые секреты
3. Используйте в workflow: `${{ secrets.SECRET_NAME }}`

## Кастомный домен (опционально)

Для использования собственного домена:
1. Добавьте файл `CNAME` в папку `public/` с вашим доменом
2. Настройте DNS записи у регистратора домена
3. В настройках Pages укажите кастомный домен

## Мониторинг

- **Google Analytics:** Добавьте код в `index.html`
- **Error tracking:** Используйте Sentry или аналоги
- **Performance:** Lighthouse CI для автоматических проверок

## Обновления

Для обновления проекта:
```bash
git pull origin main
npm install
npm run build
```

GitHub Actions автоматически разверет изменения при push.