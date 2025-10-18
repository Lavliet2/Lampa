# API документация для разработки плагинов Lampa

## Основные компоненты

### 1. Lampa.Listener
Подписка на события приложения.

```javascript
// Подписка на события
Lampa.Listener.follow('full', function (e) {
    if (e.type == 'complite') {
        // Обработка события
    }
});

// Доступные события:
// - 'app' - события приложения
// - 'full' - события полной информации о контенте
// - 'player' - события плеера
// - 'settings' - события настроек
```

### 2. Lampa.Activity
Навигация между экранами.

```javascript
// Переход на новый экран
Lampa.Activity.push({
    url: '', // URL экрана
    title: 'Заголовок экрана',
    component: 'component_name', // Имя компонента
    data: {}, // Данные для передачи
    page: 1 // Номер страницы
});
```

### 3. Lampa.Storage
Работа с настройками и хранением данных.

```javascript
// Получение значения
var value = Lampa.Storage.field('setting_name');
var value = Lampa.Storage.get('setting_name', 'default_value');

// Установка значения
Lampa.Storage.set('setting_name', 'value');
```

### 4. Lampa.SettingsApi
Добавление параметров в настройки.

```javascript
Lampa.SettingsApi.addParam({
    component: 'parser', // Компонент настроек
    param: {
        name: 'param_name',
        type: 'input', // select, input, trigger, title, static
        value: '',
        default: 'default_value'
    },
    field: {
        name: 'Название параметра',
        description: 'Описание параметра'
    },
    onChange: function (value) {
        // Обработка изменения
    }
});
```

### 5. Lampa.Select
Показ диалогов выбора.

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

### 6. Lampa.Lang
Локализация.

```javascript
// Перевод текста
var translated = Lampa.Lang.translate('key_name');
```

### 7. Lampa.Controller
Управление интерфейсом.

```javascript
// Переключение контроллера
Lampa.Controller.toggle('content');
```

## Структура данных

### Данные фильма/сериала
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
    genres: [{ id: 1, name: 'Жанр' }],
    // ... другие поля
};
```

## Примеры использования

### Создание кнопки в интерфейсе
```javascript
var button = `
    <div class="full-start__button view--custom">
        <svg>...</svg>
        <span>Текст кнопки</span>
    </div>
`;

var btn = $(Lampa.Lang.translate(button));
btn.on('hover:enter', function () {
    // Действие при нажатии
});
```

### Работа с API
```javascript
// HTTP запросы
Lampa.Request.get('https://api.example.com/data', function (data) {
    console.log('Получены данные:', data);
});

Lampa.Request.post('https://api.example.com/data', { key: 'value' }, function (data) {
    console.log('Ответ сервера:', data);
});
```

### Создание компонента
```javascript
// Регистрация компонента
Lampa.Component.add('my_component', {
    template: `
        <div class="my-component">
            <h2>Мой компонент</h2>
            <div class="content">{{content}}</div>
        </div>
    `,
    data: function () {
        return {
            content: 'Содержимое компонента'
        };
    }
});
```
