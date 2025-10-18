/**
 * Плагин заметок для Lampa
 * Позволяет добавлять заметки к фильмам и сериалам
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_notes_ready = true;

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
                            showNotesEditor(movieId, movieTitle, notes);
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

            // Функция для показа редактора заметок
            function showNotesEditor(movieId, movieTitle, currentNotes) {
                // Создаем простой редактор заметок
                var editor = `
                    <div class="notes-editor">
                        <h3>Заметки для: ${movieTitle}</h3>
                        <textarea id="notes-textarea" placeholder="Введите ваши заметки..." style="width: 100%; height: 200px; margin: 10px 0;">${currentNotes}</textarea>
                        <div class="notes-buttons">
                            <button id="save-notes" class="btn btn-primary">Сохранить</button>
                            <button id="cancel-notes" class="btn btn-secondary">Отмена</button>
                        </div>
                    </div>
                `;

                // Показываем редактор в модальном окне
                Lampa.Activity.push({
                    url: '',
                    title: 'Редактор заметок',
                    component: 'notes_editor',
                    movieId: movieId,
                    movieTitle: movieTitle,
                    editor: editor
                });
            }

            // Добавление кнопки заметок в интерфейс
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var button = `
                        <div class="full-start__button view--notes">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                            </svg>
                            <span>Заметки</span>
                        </div>
                    `;
                    
                    var btn = $(Lampa.Lang.translate(button));
                    btn.on('hover:enter', function () {
                        handleNotesClick(e.data);
                    });
                    
                    if (e.data && e.object) {
                        e.object.activity.render().find('.view--notes').last().after(btn);
                    }
                }
            });

            // Регистрация компонента редактора заметок
            Lampa.Component.add('notes_editor', {
                template: `
                    <div class="notes-editor-container">
                        <div class="notes-editor">
                            <h3>Заметки для: {{movieTitle}}</h3>
                            <textarea id="notes-textarea" placeholder="Введите ваши заметки..." style="width: 100%; height: 200px; margin: 10px 0; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">{{currentNotes}}</textarea>
                            <div class="notes-buttons" style="margin-top: 10px;">
                                <button id="save-notes" class="btn btn-primary" style="margin-right: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Сохранить</button>
                                <button id="cancel-notes" class="btn btn-secondary" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Отмена</button>
                            </div>
                        </div>
                    </div>
                `,
                data: function () {
                    return {
                        movieId: this.movieId,
                        movieTitle: this.movieTitle,
                        currentNotes: Lampa.Storage.get('movie_notes_' + this.movieId, '')
                    };
                },
                mounted: function () {
                    var self = this;
                    
                    // Обработчики кнопок
                    $('#save-notes').on('click', function () {
                        var notes = $('#notes-textarea').val();
                        Lampa.Storage.set('movie_notes_' + self.movieId, notes);
                        Lampa.Noty.show('Заметки сохранены');
                        Lampa.Activity.back();
                    });
                    
                    $('#cancel-notes').on('click', function () {
                        Lampa.Activity.back();
                    });
                }
            });

            // Добавление настроек плагина
            Lampa.SettingsApi.addParam({
                component: 'parser',
                param: {
                    name: 'notes_enabled',
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
    if (!window.plugin_notes_ready) {
        startPlugin();
    }

})();
