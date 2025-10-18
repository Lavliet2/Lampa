# Руководство по разработке плагинов для Lampa

## Введение

Lampa - это популярное приложение для просмотра кино и сериалов, которое поддерживает плагины для расширения функциональности. Плагины пишутся на JavaScript и интегрируются в интерфейс приложения.

## Архитектура плагина

### Базовая структура
```javascript
(function () {
    'use strict';
    
    function startPlugin() {
        window.plugin_[ИМЯ]_ready = true;
        
        function add() {
            // Основная логика плагина
        }
        
        // Инициализация
        if (window.appready) add(); 
        else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') { add(); }
            });
        }
    }
    
    if (!window.plugin_[ИМЯ]_ready) startPlugin();
})();
```

## Основные API методы

### 1. Lampa.Listener
Подписка на события приложения:
- `'app'` - события приложения
- `'full'` - события полной информации о контенте
- `'player'` - события плеера
- `'settings'` - события настроек

### 2. Lampa.Activity
Навигация между экранами:
```javascript
Lampa.Activity.push({
    url: '',
    title: 'Заголовок',
    component: 'component_name',
    data: {},
    page: 1
});
```

### 3. Lampa.Storage
Работа с настройками:
```javascript
// Получение
var value = Lampa.Storage.field('setting_name');
var value = Lampa.Storage.get('setting_name', 'default');

// Установка
Lampa.Storage.set('setting_name', 'value');
```

### 4. Lampa.SettingsApi
Добавление параметров в настройки:
```javascript
Lampa.SettingsApi.addParam({
    component: 'parser',
    param: {
        name: 'param_name',
        type: 'input', // select, input, trigger, title, static
        value: '',
        default: 'default_value'
    },
    field: {
        name: 'Название',
        description: 'Описание'
    },
    onChange: function (value) {
        // Обработка изменения
    }
});
```

### 5. Lampa.Select
Диалоги выбора:
```javascript
Lampa.Select.show({
    title: 'Заголовок',
    items: [
        { title: 'Опция 1', value: 'option1' },
        { title: 'Опция 2', value: 'option2' }
    ],
    onSelect: function (item) {
        // Обработка выбора
    },
    onBack: function () {
        // Обработка отмены
    }
});
```

## Создание кнопок в интерфейсе

### HTML структура кнопки
```javascript
var button = `
    <div class="full-start__button view--custom">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
            <path d="..." fill="currentColor"/>
        </svg>
        <span>Текст кнопки</span>
    </div>
`;
```

### Добавление кнопки
```javascript
Lampa.Listener.follow('full', function (e) {
    if (e.type == 'complite') {
        var btn = $(Lampa.Lang.translate(button));
        btn.on('hover:enter', function () {
            // Действие при нажатии
        });
        
        if (e.data && e.object) {
            e.object.activity.render().find('.view--custom').last().after(btn);
        }
    }
});
```

## Создание компонентов

### Регистрация компонента
```javascript
Lampa.Component.add('my_component', {
    template: `
        <div class="my-component">
            <h2>{{title}}</h2>
            <div class="content">{{content}}</div>
        </div>
    `,
    data: function () {
        return {
            title: 'Заголовок',
            content: 'Содержимое'
        };
    },
    mounted: function () {
        // Инициализация после монтирования
    }
});
```

## Работа с данными

### Структура данных фильма
```javascript
var movie = {
    id: 123,
    title: 'Название',
    original_title: 'Original Title',
    release_date: '2023-01-01',
    first_air_date: '2023-01-01',
    overview: 'Описание',
    poster_path: '/path/to/poster.jpg',
    backdrop_path: '/path/to/backdrop.jpg',
    genres: [{ id: 1, name: 'Жанр' }]
};
```

### HTTP запросы
```javascript
// GET запрос
Lampa.Request.get('https://api.example.com/data', function (data) {
    console.log('Данные:', data);
});

// POST запрос
Lampa.Request.post('https://api.example.com/data', { key: 'value' }, function (data) {
    console.log('Ответ:', data);
});
```

## Уведомления

### Показ уведомлений
```javascript
Lampa.Noty.show('Текст уведомления');
```

## Локализация

### Перевод текста
```javascript
var translated = Lampa.Lang.translate('key_name');
```

## Лучшие практики

### 1. Проверка на дублирование
```javascript
if (!window.plugin_[ИМЯ]_ready) {
    startPlugin();
}
```

### 2. Обработка ошибок
```javascript
try {
    // Код плагина
} catch (error) {
    console.error('Ошибка в плагине:', error);
}
```

### 3. Очистка ресурсов
```javascript
// Удаление обработчиков событий
Lampa.Listener.remove('event_name', handler);
```

### 4. Производительность
- Минимизируйте DOM операции
- Используйте кэширование для часто используемых данных
- Избегайте блокирующих операций

## Отладка

### Консольные сообщения
```javascript
console.log('Отладочная информация');
console.error('Ошибка:', error);
```

### Проверка состояния
```javascript
console.log('Состояние плагина:', window.plugin_[ИМЯ]_ready);
```

## Тестирование

### Локальное тестирование
1. Сохраните плагин в файл `.js`
2. Загрузите в Lampa через настройки
3. Проверьте функциональность
4. Исправьте ошибки

### Отладка в браузере
1. Откройте инструменты разработчика
2. Перейдите на вкладку Console
3. Проверьте сообщения об ошибках
4. Используйте breakpoints для отладки

## Публикация

### Подготовка к публикации
1. Убедитесь, что плагин работает стабильно
2. Добавьте комментарии к коду
3. Создайте README с описанием
4. Протестируйте на разных версиях Lampa

### Размещение на GitHub
1. Создайте репозиторий
2. Добавьте файл плагина
3. Создайте README.md
4. Добавьте лицензию
5. Создайте релиз

## Примеры плагинов

В папке проекта есть несколько примеров:
- `plugin-template.js` - базовый шаблон
- `notes-plugin.js` - плагин заметок
- `export-plugin.js` - плагин экспорта

## Заключение

Разработка плагинов для Lampa позволяет значительно расширить функциональность приложения. Используйте предоставленные API методы и следуйте лучшим практикам для создания качественных плагинов.
