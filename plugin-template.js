/**
 * Базовый шаблон плагина для Lampa
 * Замените [PLUGIN_NAME] на название вашего плагина
 */

(function () {
    'use strict';

    function startPlugin() {
        // Проверка на дублирование плагина
        window.plugin_[PLUGIN_NAME]_ready = true;

        function add() {
            // Основная логика плагина
            
            // 1. Подписка на события
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // Логика при загрузке полной информации о фильме/сериале
                    console.log('Плагин [PLUGIN_NAME]: Получены данные', e.data);
                }
            });

            // 2. Добавление кнопки в интерфейс
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var button = `
                        <div class="full-start__button view--custom">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                            </svg>
                            <span>#{custom_button}</span>
                        </div>
                    `;
                    
                    var btn = $(Lampa.Lang.translate(button));
                    btn.on('hover:enter', function () {
                        // Действие при нажатии на кнопку
                        handleButtonClick(e.data);
                    });
                    
                    if (e.data && e.object) {
                        e.object.activity.render().find('.view--custom').last().after(btn);
                    }
                }
            });

            // 3. Добавление параметров в настройки
            Lampa.SettingsApi.addParam({
                component: 'parser', // или другой компонент
                param: {
                    name: 'custom_setting',
                    type: 'input', // доступно: select, input, trigger, title, static
                    value: '',
                    default: 'default_value'
                },
                field: {
                    name: 'Настройка плагина',
                    description: 'Описание настройки плагина'
                },
                onChange: function (value) {
                    console.log('Настройка изменена:', value);
                }
            });

            // 4. Обновление настроек
            Lampa.Settings.main().update();
        }

        // Инициализация плагина
        if (window.appready) {
            add();
        } else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') {
                    add();
                }
            });
        }
    }

    // Проверка на дублирование и запуск
    if (!window.plugin_[PLUGIN_NAME]_ready) {
        startPlugin();
    }

})();
