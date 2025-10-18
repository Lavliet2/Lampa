/**
 * Плагин экспорта для Lampa
 * Позволяет экспортировать список просмотренных фильмов и сериалов
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_export_ready = true;

        function add() {
            // Функция для экспорта данных
            function exportData(format) {
                var watchedItems = Lampa.Storage.get('watched_items', []);
                
                if (watchedItems.length === 0) {
                    Lampa.Noty.show('Нет данных для экспорта');
                    return;
                }

                var exportData = '';
                
                if (format === 'json') {
                    exportData = JSON.stringify(watchedItems, null, 2);
                } else if (format === 'csv') {
                    exportData = 'Название,Год,Жанр,Рейтинг,Дата просмотра\n';
                    watchedItems.forEach(function(item) {
                        exportData += `"${item.title}","${item.year}","${item.genres}","${item.rating}","${item.watched_date}"\n`;
                    });
                } else if (format === 'txt') {
                    exportData = 'Список просмотренных фильмов и сериалов:\n\n';
                    watchedItems.forEach(function(item, index) {
                        exportData += `${index + 1}. ${item.title} (${item.year})\n`;
                        exportData += `   Жанр: ${item.genres}\n`;
                        exportData += `   Рейтинг: ${item.rating}\n`;
                        exportData += `   Дата просмотра: ${item.watched_date}\n\n`;
                    });
                }

                // Создаем и скачиваем файл
                downloadFile(exportData, 'lampa_export.' + format, 'text/plain');
            }

            // Функция для скачивания файла
            function downloadFile(content, filename, mimeType) {
                var blob = new Blob([content], { type: mimeType });
                var url = URL.createObjectURL(blob);
                
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                Lampa.Noty.show('Файл экспортирован: ' + filename);
            }

            // Обработчик нажатия на кнопку экспорта
            function handleExportClick(data) {
                Lampa.Select.show({
                    title: 'Экспорт данных',
                    items: [
                        {
                            title: 'Экспорт в JSON',
                            value: 'json',
                            description: 'Структурированный формат для программного использования'
                        },
                        {
                            title: 'Экспорт в CSV',
                            value: 'csv',
                            description: 'Табличный формат для Excel и других программ'
                        },
                        {
                            title: 'Экспорт в TXT',
                            value: 'txt',
                            description: 'Простой текстовый формат для чтения'
                        },
                        {
                            title: 'Статистика',
                            value: 'stats',
                            description: 'Показать статистику просмотров'
                        }
                    ],
                    onSelect: function (item) {
                        if (item.value === 'stats') {
                            showStatistics();
                        } else {
                            exportData(item.value);
                        }
                    },
                    onBack: function () {
                        Lampa.Controller.toggle('content');
                    }
                });
            }

            // Функция для показа статистики
            function showStatistics() {
                var watchedItems = Lampa.Storage.get('watched_items', []);
                var totalItems = watchedItems.length;
                var movies = watchedItems.filter(item => item.type === 'movie').length;
                var series = watchedItems.filter(item => item.type === 'tv').length;
                
                var genres = {};
                watchedItems.forEach(function(item) {
                    if (item.genres) {
                        item.genres.split(',').forEach(function(genre) {
                            genre = genre.trim();
                            genres[genre] = (genres[genre] || 0) + 1;
                        });
                    }
                });
                
                var topGenres = Object.keys(genres)
                    .sort(function(a, b) { return genres[b] - genres[a]; })
                    .slice(0, 5);
                
                var statsText = `
                    <div class="statistics">
                        <h3>Статистика просмотров</h3>
                        <p><strong>Всего просмотрено:</strong> ${totalItems}</p>
                        <p><strong>Фильмы:</strong> ${movies}</p>
                        <p><strong>Сериалы:</strong> ${series}</p>
                        <p><strong>Топ жанры:</strong></p>
                        <ul>
                            ${topGenres.map(genre => `<li>${genre}: ${genres[genre]}</li>`).join('')}
                        </ul>
                    </div>
                `;
                
                Lampa.Activity.push({
                    url: '',
                    title: 'Статистика',
                    component: 'statistics',
                    stats: statsText
                });
            }

            // Добавление кнопки экспорта в интерфейс
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var button = `
                        <div class="full-start__button view--export">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                            </svg>
                            <span>Экспорт</span>
                        </div>
                    `;
                    
                    var btn = $(Lampa.Lang.translate(button));
                    btn.on('hover:enter', function () {
                        handleExportClick(e.data);
                    });
                    
                    if (e.data && e.object) {
                        e.object.activity.render().find('.view--export').last().after(btn);
                    }
                }
            });

            // Регистрация компонента статистики
            Lampa.Component.add('statistics', {
                template: `
                    <div class="statistics-container">
                        <div class="statistics">
                            <h3>Статистика просмотров</h3>
                            <div class="stats-content">
                                {{stats}}
                            </div>
                            <div class="stats-buttons" style="margin-top: 20px;">
                                <button id="export-stats" class="btn btn-primary" style="margin-right: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Экспорт статистики</button>
                                <button id="close-stats" class="btn btn-secondary" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Закрыть</button>
                            </div>
                        </div>
                    </div>
                `,
                data: function () {
                    return {
                        stats: this.stats
                    };
                },
                mounted: function () {
                    var self = this;
                    
                    $('#export-stats').on('click', function () {
                        var watchedItems = Lampa.Storage.get('watched_items', []);
                        var statsData = JSON.stringify(watchedItems, null, 2);
                        downloadFile(statsData, 'lampa_statistics.json', 'application/json');
                    });
                    
                    $('#close-stats').on('click', function () {
                        Lampa.Activity.back();
                    });
                }
            });

            // Добавление настроек плагина
            Lampa.SettingsApi.addParam({
                component: 'parser',
                param: {
                    name: 'export_enabled',
                    type: 'select',
                    value: 'true',
                    default: 'true'
                },
                field: {
                    name: 'Включить экспорт',
                    description: 'Позволяет экспортировать список просмотренных фильмов и сериалов'
                },
                onChange: function (value) {
                    console.log('Настройка экспорта изменена:', value);
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
    if (!window.plugin_export_ready) {
        startPlugin();
    }

})();
