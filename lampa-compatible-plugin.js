/**
 * Совместимый плагин для Lampa
 * Использует тот же формат, что и рабочие плагины
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_lampa_compatible_ready = true;

        function add() {
            // Простая функция для тестирования
            function testFunction() {
                if (typeof Lampa !== 'undefined' && Lampa.Noty) {
                    Lampa.Noty.show('Совместимый плагин работает!');
                } else {
                    alert('Совместимый плагин работает!');
                }
            }

            // Добавление кнопки в интерфейс
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var button = '<div class="full-start__button view--compatible"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5Z" fill="currentColor"/></svg><span>Совместимый</span></div>';
                    
                    var btn = $(button);
                    btn.on('hover:enter', function () {
                        testFunction();
                    });
                    
                    if (e.data && e.object) {
                        e.object.activity.render().find('.view--compatible').last().after(btn);
                    }
                }
            });
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
    if (!window.plugin_lampa_compatible_ready) {
        startPlugin();
    }

})();
