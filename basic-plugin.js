/**
 * Базовый плагин для Lampa
 * Максимально простая версия
 */

(function () {
    'use strict';

    if (window.plugin_basic_ready) {
        return;
    }

    window.plugin_basic_ready = true;

    function init() {
        if (typeof Lampa === 'undefined') {
            setTimeout(init, 100);
            return;
        }

        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var button = '<div class="full-start__button view--basic"><span>Базовый</span></div>';
                var btn = $(button);
                btn.on('hover:enter', function () {
                    alert('Базовый плагин работает!');
                });
                
                if (e.data && e.object) {
                    e.object.activity.render().find('.view--basic').last().after(btn);
                }
            }
        });
    }

    init();

})();
