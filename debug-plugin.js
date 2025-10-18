/**
 * Отладочный плагин для Lampa
 * С дополнительными проверками и логированием
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_debug_ready = true;
        console.log('🔌 Отладочный плагин загружен');

        function add() {
            console.log('🔧 Инициализация отладочного плагина');
            
            // Простая функция для тестирования
            function testFunction() {
                console.log('✅ Тестовая функция вызвана');
                Lampa.Noty.show('Отладочный плагин работает!');
            }

            // Добавление кнопки в интерфейс
            Lampa.Listener.follow('full', function (e) {
                console.log('📺 Событие full получено:', e.type);
                
                if (e.type == 'complite') {
                    console.log('✅ Фильм загружен, добавляем кнопку');
                    
                    var button = '<div class="full-start__button view--debug"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5Z" fill="currentColor"/></svg><span>Отладка</span></div>';
                    
                    var btn = $(Lampa.Lang.translate(button));
                    console.log('🔘 Кнопка создана:', btn);
                    
                    btn.on('hover:enter', function () {
                        console.log('🖱️ Кнопка нажата');
                        testFunction();
                    });
                    
                    if (e.data && e.object) {
                        console.log('📱 Добавляем кнопку в интерфейс');
                        e.object.activity.render().find('.view--debug').last().after(btn);
                    } else {
                        console.log('❌ Нет данных для добавления кнопки');
                    }
                }
            });

            // Добавление настроек
            Lampa.SettingsApi.addParam({
                component: 'parser',
                param: {
                    name: 'debug_enabled',
                    type: 'select',
                    value: 'true',
                    default: 'true'
                },
                field: {
                    name: 'Включить отладочный плагин',
                    description: 'Плагин с дополнительной отладкой для проверки работы'
                },
                onChange: function (value) {
                    console.log('⚙️ Настройка отладочного плагина изменена:', value);
                }
            });

            Lampa.Settings.main().update();
            console.log('✅ Отладочный плагин инициализирован');
        }

        if (window.appready) {
            console.log('🚀 Lampa готова, запускаем плагин');
            add();
        } else {
            console.log('⏳ Ожидаем готовности Lampa');
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') {
                    console.log('🚀 Lampa готова, запускаем плагин');
                    add();
                }
            });
        }
    }

    if (!window.plugin_debug_ready) {
        console.log('🔄 Запускаем отладочный плагин');
        startPlugin();
    } else {
        console.log('⚠️ Отладочный плагин уже загружен');
    }

})();
