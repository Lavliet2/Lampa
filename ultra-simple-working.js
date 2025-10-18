/**
 * Ультра-простой рабочий плагин
 * Максимально упрощенная версия на основе анализа рабочих плагинов
 */

(function () {
    'use strict';

    if (window.plugin_ultra_simple_ready) {
        return;
    }

    window.plugin_ultra_simple_ready = true;

    function init() {
        if (typeof Lampa === 'undefined') {
            setTimeout(init, 100);
            return;
        }

        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var button = '<div class="full-start__button view--ultra"><span>Ультра</span></div>';
                var btn = $(button);
                btn.on('hover:enter', function () {
                    alert('Ультра-простой плагин работает!');
                });
                
                if (e.data && e.object) {
                    e.object.activity.render().find('.view--ultra').last().after(btn);
                }
            }
        });
    }

    init();

})();
