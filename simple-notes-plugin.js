/**
 * Простой плагин заметок для Lampa
 * Минимальная версия без сложных компонентов
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_simple_notes_ready = true;

        function add() {
            // Функция для обработки нажатия на кнопку заметок
            function handleNotesClick(data) {
                var movieId = data.movie.id;
                var movieTitle = data.movie.title || data.movie.original_title;
                
                // Получаем существующие заметки
                var notes = Lampa.Storage.get('movie_notes_' + movieId, '');
                
                // Показываем диалог для редактирования заметок
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
                            // Используем простой prompt вместо сложного редактора
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

            // Добавление кнопки заметок в интерфейс
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var button = '<div class="full-start__button view--notes"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/></svg><span>Заметки</span></div>';
                    
                    var btn = $(Lampa.Lang.translate(button));
                    btn.on('hover:enter', function () {
                        handleNotesClick(e.data);
                    });
                    
                    if (e.data && e.object) {
                        e.object.activity.render().find('.view--notes').last().after(btn);
                    }
                }
            });

            // Добавление настроек плагина
            Lampa.SettingsApi.addParam({
                component: 'parser',
                param: {
                    name: 'simple_notes_enabled',
                    type: 'select',
                    value: 'true',
                    default: 'true'
                },
                field: {
                    name: 'Включить заметки',
                    description: 'Позволяет добавлять заметки к фильмам и сериалам'
                },
                onChange: function (value) {
                    console.log('Настройка заметок изменена:', value);
                }
            });

            // Обновление настроек
            Lampa.Settings.main().update();
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
    if (!window.plugin_simple_notes_ready) {
        startPlugin();
    }

})();
