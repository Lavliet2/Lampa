/**
 * Ультра-простой плагин для Lampa
 * Минимальный код без сложных конструкций
 */

(function () {
    'use strict';

    // Проверяем на дублирование
    if (window.plugin_ultra_simple_ready) {
        return;
    }

    window.plugin_ultra_simple_ready = true;

    // Ждем готовности Lampa
    function waitForLampa() {
        if (typeof Lampa !== 'undefined' && Lampa.Listener) {
            initPlugin();
        } else {
            setTimeout(waitForLampa, 100);
        }
    }

    function initPlugin() {
        // Простая функция для тестирования
        function testFunction() {
            if (Lampa.Noty) {
                Lampa.Noty.show('Ультра-простой плагин работает!');
            } else {
                alert('Ультра-простой плагин работает!');
            }
        }

        // Добавление кнопки в интерфейс
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var button = '<div class="full-start__button view--ultra"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5Z" fill="currentColor"/></svg><span>Ультра</span></div>';
                
                var btn = $(button);
                btn.on('hover:enter', function () {
                    testFunction();
                });
                
                if (e.data && e.object) {
                    e.object.activity.render().find('.view--ultra').last().after(btn);
                }
            }
        });
    }

    // Запускаем ожидание Lampa
    waitForLampa();

})();
