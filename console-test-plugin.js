/**
 * Плагин для тестирования через консоль
 * Максимально простой для отладки
 */

(function () {
    'use strict';

    console.log('Загрузка плагина через консоль...');

    if (window.plugin_console_test_ready) {
        console.log('Плагин уже загружен');
        return;
    }

    window.plugin_console_test_ready = true;
    console.log('Плагин инициализирован');

    function init() {
        console.log('Проверка Lampa...');
        
        if (typeof Lampa === 'undefined') {
            console.log('Lampa не найден, повтор через 100мс...');
            setTimeout(init, 100);
            return;
        }

        console.log('Lampa найден, настройка слушателей...');

        Lampa.Listener.follow('full', function (e) {
            console.log('Событие full получено:', e.type);
            
            if (e.type == 'complite') {
                console.log('Добавление кнопки...');
                
                var button = '<div class="full-start__button view--console-test"><span>Консоль</span></div>';
                var btn = $(button);
                
                btn.on('hover:enter', function () {
                    console.log('Кнопка нажата!');
                    alert('Плагин из консоли работает!');
                });
                
                if (e.data && e.object) {
                    console.log('Добавление кнопки в интерфейс...');
                    e.object.activity.render().find('.view--console-test').last().after(btn);
                    console.log('Кнопка добавлена успешно');
                } else {
                    console.log('Ошибка: e.data или e.object не найдены');
                }
            }
        });

        console.log('Слушатели настроены');
    }

    init();
    console.log('Плагин загружен полностью');

})();
