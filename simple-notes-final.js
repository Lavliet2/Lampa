/**
 * Простой плагин заметок для Lampa
 * Финальная версия без сложных конструкций
 */

(function () {
    'use strict';

    // Проверяем на дублирование
    if (window.plugin_simple_notes_final_ready) {
        return;
    }

    window.plugin_simple_notes_final_ready = true;

    // Ждем готовности Lampa
    function waitForLampa() {
        if (typeof Lampa !== 'undefined' && Lampa.Listener) {
            initPlugin();
        } else {
            setTimeout(waitForLampa, 100);
        }
    }

    function initPlugin() {
        // Функция для обработки заметок
        function handleNotes(data) {
            var movieId = data.movie.id;
            var movieTitle = data.movie.title || data.movie.original_title;
            
            // Получаем существующие заметки
            var notes = Lampa.Storage.get('movie_notes_' + movieId, '');
            
            // Показываем диалог
            Lampa.Select.show({
                title: 'Заметки для: ' + movieTitle,
                items: [
                    {
                        title: 'Редактировать заметки',
                        value: 'edit',
                        description: notes ? 'Текущая заметка: ' + notes.substring(0, 50) + '...' : 'Заметка не добавлена'
                    },
                    {
                        title: 'Очистить заметки',
                        value: 'clear',
                        description: 'Удалить все заметки для этого фильма'
                    }
                ],
                onSelect: function (item) {
                    if (item.value === 'edit') {
                        var newNotes = prompt('Введите заметки для: ' + movieTitle, notes);
                        if (newNotes !== null) {
                            Lampa.Storage.set('movie_notes_' + movieId, newNotes);
                            Lampa.Noty.show('Заметки сохранены');
                        }
                    } else if (item.value === 'clear') {
                        Lampa.Storage.set('movie_notes_' + movieId, '');
                        Lampa.Noty.show('Заметки удалены');
                    }
                },
                onBack: function () {
                    Lampa.Controller.toggle('content');
                }
            });
        }

        // Добавление кнопки в интерфейс
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var button = '<div class="full-start__button view--notes"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/></svg><span>Заметки</span></div>';
                
                var btn = $(button);
                btn.on('hover:enter', function () {
                    handleNotes(e.data);
                });
                
                if (e.data && e.object) {
                    e.object.activity.render().find('.view--notes').last().after(btn);
                }
            }
        });
    }

    // Запускаем ожидание Lampa
    waitForLampa();

})();
