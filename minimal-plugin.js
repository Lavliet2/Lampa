/**
 * Минимальный плагин для Lampa
 * Максимально простая версия для тестирования
 */

(function () {
    'use strict';

    // Проверяем на дублирование
    if (window.plugin_minimal_ready) {
        return;
    }

    window.plugin_minimal_ready = true;
    console.log('🔌 Минимальный плагин загружен');

    // Ждем готовности Lampa
    function waitForLampa() {
        if (typeof Lampa !== 'undefined' && Lampa.Listener) {
            console.log('✅ Lampa найдена, инициализируем плагин');
            initPlugin();
        } else {
            console.log('⏳ Ожидаем Lampa...');
            setTimeout(waitForLampa, 100);
        }
    }

    function initPlugin() {
        console.log('🔧 Инициализация минимального плагина');

        // Простая функция для тестирования
        function testFunction() {
            console.log('✅ Тестовая функция вызвана');
            if (Lampa.Noty) {
                Lampa.Noty.show('Минимальный плагин работает!');
            } else {
                alert('Минимальный плагин работает!');
            }
        }

        // Добавление кнопки в интерфейс
        Lampa.Listener.follow('full', function (e) {
            console.log('📺 Событие full получено:', e.type);
            
            if (e.type == 'complite') {
                console.log('✅ Фильм загружен, добавляем кнопку');
                
                var button = '<div class="full-start__button view--minimal"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5Z" fill="currentColor"/></svg><span>Тест</span></div>';
                
                var btn = $(button);
                console.log('🔘 Кнопка создана');
                
                btn.on('hover:enter', function () {
                    console.log('🖱️ Кнопка нажата');
                    testFunction();
                });
                
                if (e.data && e.object) {
                    console.log('📱 Добавляем кнопку в интерфейс');
                    e.object.activity.render().find('.view--minimal').last().after(btn);
                } else {
                    console.log('❌ Нет данных для добавления кнопки');
                }
            }
        });

        console.log('✅ Минимальный плагин инициализирован');
    }

    // Запускаем ожидание Lampa
    waitForLampa();

})();
