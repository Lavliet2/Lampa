/**
 * Плагин кнопки любви для Lampa
 * Добавляет милую кнопку с сердечком в верхнее меню
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_love_button_ready = true;

        function add() {
            // Функция для показа сообщения любви
            function showLoveMessage() {
                if (typeof Lampa !== 'undefined' && Lampa.Noty) {
                    Lampa.Noty.show('Привет кисунька, я тебя люблю =* 💕');
                } else {
                    alert('Привет кисунька, я тебя люблю =* 💕');
                }
            }

            // Добавляем кнопку в верхнее меню
            function addLoveButton() {
                // Создаем кнопку с сердечком
                var loveButton = $('<div class="head__love-button" style="' +
                    'position: absolute; ' +
                    'right: 20px; ' +
                    'top: 50%; ' +
                    'transform: translateY(-50%); ' +
                    'width: 40px; ' +
                    'height: 40px; ' +
                    'background: linear-gradient(45deg, #ff6b6b, #ff8e8e); ' +
                    'border-radius: 50%; ' +
                    'display: flex; ' +
                    'align-items: center; ' +
                    'justify-content: center; ' +
                    'cursor: pointer; ' +
                    'transition: all 0.3s ease; ' +
                    'box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3); ' +
                    'z-index: 1000;' +
                    '">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="color: white; fill: currentColor;">' +
                    '<path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>' +
                    '</svg>' +
                    '</div>');

                // Добавляем эффекты при наведении
                loveButton.on('mouseenter', function() {
                    $(this).css({
                        'transform': 'translateY(-50%) scale(1.1)',
                        'box-shadow': '0 4px 20px rgba(255, 107, 107, 0.5)'
                    });
                });

                loveButton.on('mouseleave', function() {
                    $(this).css({
                        'transform': 'translateY(-50%) scale(1)',
                        'box-shadow': '0 2px 10px rgba(255, 107, 107, 0.3)'
                    });
                });

                // Обработчик клика
                loveButton.on('click', function() {
                    showLoveMessage();
                });

                // Добавляем кнопку в верхнее меню
                var headElement = $('.head');
                if (headElement.length > 0) {
                    headElement.append(loveButton);
                    console.log('Кнопка любви добавлена в верхнее меню');
                } else {
                    // Если элемент не найден, пробуем через некоторое время
                    setTimeout(addLoveButton, 1000);
                }
            }

            // Инициализация кнопки
            if (window.appready) {
                addLoveButton();
            } else {
                Lampa.Listener.follow('app', function (e) {
                    if (e.type == 'ready') {
                        addLoveButton();
                    }
                });
            }
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
    if (!window.plugin_love_button_ready) {
        startPlugin();
    }

})();
