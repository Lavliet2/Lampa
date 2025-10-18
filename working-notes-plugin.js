/**
 * Рабочий плагин заметок для Lampa
 * Адаптирован под cub.red загрузку
 */

(function () {
    'use strict';

    // Проверяем, что Lampa загружена
    if (typeof Lampa === 'undefined') {
        console.log('❌ Lampa не найдена, ждем загрузки...');
        return;
    }

    // Проверяем на дублирование
    if (window.plugin_working_notes_ready) {
        console.log('⚠️ Плагин заметок уже загружен');
        return;
    }

    window.plugin_working_notes_ready = true;
    console.log('🔌 Плагин заметок загружен');

    function initPlugin() {
        console.log('🔧 Инициализация плагина заметок');

        // Функция для обработки нажатия на кнопку заметок
        function handleNotesClick(data) {
            console.log('📝 Обработка клика по заметкам', data);
            
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
                        // Используем простой prompt
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
            console.log('📺 Событие full получено:', e.type);
            
            if (e.type == 'complite') {
                console.log('✅ Фильм загружен, добавляем кнопку заметок');
                
                var button = '<div class="full-start__button view--notes"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/></svg><span>Заметки</span></div>';
                
                var btn = $(Lampa.Lang.translate(button));
                console.log('🔘 Кнопка заметок создана');
                
                btn.on('hover:enter', function () {
                    console.log('🖱️ Кнопка заметок нажата');
                    handleNotesClick(e.data);
                });
                
                if (e.data && e.object) {
                    console.log('📱 Добавляем кнопку в интерфейс');
                    e.object.activity.render().find('.view--notes').last().after(btn);
                } else {
                    console.log('❌ Нет данных для добавления кнопки');
                }
            }
        });

        // Добавление настроек плагина
        Lampa.SettingsApi.addParam({
            component: 'parser',
            param: {
                name: 'working_notes_enabled',
                type: 'select',
                value: 'true',
                default: 'true'
            },
            field: {
                name: 'Включить заметки (Рабочая версия)',
                description: 'Позволяет добавлять заметки к фильмам и сериалам'
            },
            onChange: function (value) {
                console.log('⚙️ Настройка заметок изменена:', value);
            }
        });

        // Обновление настроек
        Lampa.Settings.main().update();
        console.log('✅ Плагин заметок инициализирован');
    }

    // Инициализация плагина
    if (window.appready) {
        console.log('🚀 Lampa готова, запускаем плагин');
        initPlugin();
    } else {
        console.log('⏳ Ожидаем готовности Lampa');
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                console.log('🚀 Lampa готова, запускаем плагин');
                initPlugin();
            }
        });
    }

})();
