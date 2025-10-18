# 📤 Загрузка плагинов на GitHub для Lampa

## 🚀 Пошаговая инструкция:

### **Шаг 1: Подготовка файлов**
Убедитесь, что у вас есть файлы:
- `github-notes-plugin.js` - исправленная версия плагина заметок
- `test-plugin.js` - тестовый плагин
- `simple-notes-plugin.js` - простая версия плагина

### **Шаг 2: Загрузка на GitHub**
1. Откройте ваш репозиторий: https://github.com/Lavliet2/Lampa
2. Нажмите **"Add file"** → **"Upload files"**
3. Перетащите файлы или выберите их
4. Напишите commit message: "Add working plugins for Lampa"
5. Нажмите **"Commit changes"**

### **Шаг 3: Получение ссылок**
После загрузки файлы будут доступны по ссылкам:

**Плагин заметок:**
```
https://raw.githubusercontent.com/Lavliet2/Lampa/main/github-notes-plugin.js
```

**Тестовый плагин:**
```
https://raw.githubusercontent.com/Lavliet2/Lampa/main/test-plugin.js
```

**Простая версия:**
```
https://raw.githubusercontent.com/Lavliet2/Lampa/main/simple-notes-plugin.js
```

## 🔧 **Альтернативные способы загрузки:**

### **Способ 1: Через GitHub CLI**
```bash
# Установите GitHub CLI
gh auth login
gh repo create Lavliet2/Lampa --public
gh repo upload Lavliet2/Lampa github-notes-plugin.js
```

### **Способ 2: Через Git**
```bash
git add github-notes-plugin.js
git commit -m "Add working plugin"
git push origin main
```

### **Способ 3: Через веб-интерфейс GitHub**
1. Перейдите в репозиторий
2. Нажмите **"Create new file"**
3. Назовите файл `github-notes-plugin.js`
4. Вставьте код из файла
5. Нажмите **"Commit new file"**

## 📱 **Загрузка в Lampa:**

### **Метод 1: Через настройки**
1. Откройте Lampa
2. Настройки → Парсеры
3. Вставьте ссылку на плагин
4. Сохраните

### **Метод 2: Через URL**
1. Откройте Lampa
2. Введите URL плагина
3. Нажмите "Загрузить"

## ✅ **Проверка работы:**

После загрузки плагина:
1. Перезапустите Lampa
2. Откройте любой фильм
3. Найдите кнопку "Заметки"
4. Нажмите на неё
5. Проверьте, что диалог открывается

## 🐛 **Решение проблем:**

### **Проблема: "Не удалось загрузить"**
**Решение:**
1. Проверьте, что файл доступен по ссылке
2. Убедитесь, что файл содержит только JavaScript код
3. Попробуйте другой плагин

### **Проблема: "CORS ошибка"**
**Решение:**
1. Используйте GitHub Pages
2. Или загрузите код напрямую в Lampa

### **Проблема: "Плагин не работает"**
**Решение:**
1. Проверьте консоль браузера (F12)
2. Убедитесь, что Lampa полностью загружена
3. Попробуйте перезапустить Lampa

## 🎯 **Рекомендуемый порядок:**

1. **Загрузите тестовый плагин** - `test-plugin.js`
2. **Проверьте его работу** - должна появиться кнопка "Тест"
3. **Если работает** - загрузите основной плагин
4. **Если не работает** - проверьте настройки Lampa

## 📋 **Список файлов для загрузки:**

- ✅ `github-notes-plugin.js` - основной плагин заметок
- ✅ `test-plugin.js` - тестовый плагин
- ✅ `simple-notes-plugin.js` - простая версия
- ✅ `plugin-template.js` - шаблон для разработки

## 🔗 **Полезные ссылки:**

- [Ваш репозиторий](https://github.com/Lavliet2/Lampa)
- [GitHub Raw URLs](https://raw.githubusercontent.com/Lavliet2/Lampa/main/)
- [GitHub Pages](https://pages.github.com/)
