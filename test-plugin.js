/**
 * Тестовый плагин для Lampa
 * Максимально простая версия для проверки загрузки
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_test_ready = true;

        function add() {
            // Простая функция для тестирования
            function testFunction() {
                Lampa.Noty.show('Тестовый плагин работает!');
            }

            // Добавление кнопки в интерфейс
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var button = '<div class="full-start__button view--test"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.5,8L11,13.5L7.5,10L6,11.5L11,16.5Z" fill="currentColor"/></svg><span>Тест</span></div>';
                    
                    var btn = $(Lampa.Lang.translate(button));
                    btn.on('hover:enter', function () {
                        testFunction();
                    });
                    
                    if (e.data && e.object) {
                        e.object.activity.render().find('.view--test').last().after(btn);
                    }
                }
            });

            // Добавление настроек
            Lampa.SettingsApi.addParam({
                component: 'parser',
                param: {
                    name: 'test_enabled',
                    type: 'select',
                    value: 'true',
                    default: 'true'
                },
                field: {
                    name: 'Включить тестовый плагин',
                    description: 'Простой тестовый плагин для проверки загрузки'
                },
                onChange: function (value) {
                    console.log('Тестовый плагин:', value);
                }
            });

            Lampa.Settings.main().update();
        }

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

    if (!window.plugin_test_ready) {
        startPlugin();
    }

})();
