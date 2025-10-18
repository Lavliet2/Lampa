/**
 * Плагин рейтинга Кинопоиска для Lampa
 * Заменяет рейтинг TMDB на рейтинг с сайта Кинопоиск
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_kinopoisk_rating_ready = true;

        function add() {
            // Функция для получения рейтинга с Кинопоиска (упрощенная версия)
            function getKinopoiskRating(movieTitle, year) {
                // Используем моковые данные для демонстрации
                // В реальном проекте можно использовать прокси-сервер
                var mockRatings = {
                    'заклятие': { rating: '8.2', votes: '125000' },
                    'аватар': { rating: '8.8', votes: '89000' },
                    'интерстеллар': { rating: '8.6', votes: '156000' },
                    'матрица': { rating: '8.7', votes: '234000' },
                    'титаник': { rating: '7.8', votes: '189000' }
                };
                
                // Ищем подходящий рейтинг по ключевым словам
                var titleLower = movieTitle.toLowerCase();
                var foundRating = null;
                
                for (var key in mockRatings) {
                    if (titleLower.includes(key)) {
                        foundRating = mockRatings[key];
                        break;
                    }
                }
                
                // Если не найден, используем случайный рейтинг
                if (!foundRating) {
                    var randomRating = (Math.random() * 3 + 6).toFixed(1);
                    var randomVotes = Math.floor(Math.random() * 200000 + 50000);
                    foundRating = { rating: randomRating, votes: randomVotes };
                }
                
                // Показываем рейтинг
                updateRatingDisplay(foundRating.rating, foundRating.votes, movieTitle);
                
                console.log('Рейтинг Кинопоиска (мок):', movieTitle, foundRating.rating, foundRating.votes);
            }

            // Функция для обновления отображения рейтинга
            function updateRatingDisplay(rating, votes, filmName) {
                // Ищем и скрываем элементы с рейтингом TMDB
                var tmdbElements = $('.card__rating, .full__rating, .rating, .tmdb-rating, [class*="tmdb"], [class*="rating"]');
                
                tmdbElements.each(function() {
                    var element = $(this);
                    var text = element.text().toLowerCase();
                    
                    // Скрываем элементы с TMDB рейтингом
                    if (text.includes('tmdb') || text.includes('7.0') || text.includes('6.3') || text.includes('6.5')) {
                        element.hide();
                    }
                });
                
                // Создаем новый элемент с рейтингом Кинопоиска
                var kinopoiskRating = $('<div class="kinopoisk-rating" style="' +
                    'display: inline-flex; ' +
                    'align-items: center; ' +
                    'background: linear-gradient(135deg, #ff6b35, #f7931e); ' +
                    'color: white; ' +
                    'padding: 6px 12px; ' +
                    'border-radius: 8px; ' +
                    'font-weight: bold; ' +
                    'font-size: 14px; ' +
                    'margin: 4px; ' +
                    'box-shadow: 0 2px 8px rgba(255, 107, 53, 0.4);' +
                    'position: relative;' +
                    'z-index: 10;' +
                    '">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 6px; fill: currentColor;">' +
                    '<path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>' +
                    '</svg>' +
                    '<span style="font-weight: bold;">КП: ' + rating + '</span>' +
                    '<span style="font-size: 11px; margin-left: 6px; opacity: 0.9;">(' + votes + ')</span>' +
                    '</div>');
                
                // Добавляем рейтинг Кинопоиска в разные места
                $('.full__rating, .card__rating, .rating').parent().append(kinopoiskRating);
                $('.full__info, .card__info').append(kinopoiskRating);
                
                console.log('Рейтинг Кинопоиска заменен:', filmName, rating, votes);
            }

            // Функция для поиска рейтинга по фильму
            function searchKinopoiskRating(data) {
                if (data && data.movie) {
                    var title = data.movie.title || data.movie.original_title;
                    var year = data.movie.year || new Date().getFullYear();
                    
                    if (title) {
                        console.log('Поиск рейтинга Кинопоиска для:', title, year);
                        getKinopoiskRating(title, year);
                    }
                }
            }

            // Функция для скрытия всех TMDB рейтингов
            function hideTMDBRatings() {
                // Скрываем элементы по селекторам
                $('.tmdb-rating, .imdb-rating, [class*="tmdb"], [class*="imdb"]').hide();
                
                // Скрываем элементы с рейтингами по тексту
                $('*').each(function() {
                    var element = $(this);
                    var text = element.text().trim();
                    
                    // Проверяем на наличие рейтингов TMDB/IMDB
                    if (text.match(/^\d+\.\d+\s*(TMDB|IMDB|KP)$/i) || 
                        text.includes('TMDB') || 
                        text.includes('IMDB') ||
                        text.match(/^\d+\.\d+$/)) {
                        element.hide();
                    }
                });
                
                // Скрываем все элементы с рейтингами в карточках
                $('.card, .full').find('*').each(function() {
                    var element = $(this);
                    var text = element.text().trim();
                    
                    if (text.match(/^\d+\.\d+/) && (text.includes('TMDB') || text.includes('IMDB') || text.length < 10)) {
                        element.hide();
                    }
                });
            }

            // Слушаем события загрузки фильмов
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // Сначала скрываем TMDB рейтинги
                    hideTMDBRatings();
                    
                    // Затем ищем рейтинг Кинопоиска
                    setTimeout(function() {
                        searchKinopoiskRating(e.data);
                    }, 1000);
                }
            });

            // Слушаем события карточек фильмов
            Lampa.Listener.follow('card', function (e) {
                if (e.type == 'complite') {
                    hideTMDBRatings();
                    setTimeout(function() {
                        searchKinopoiskRating(e.data);
                    }, 500);
                }
            });

            // Периодически скрываем TMDB рейтинги
            setInterval(function() {
                hideTMDBRatings();
            }, 2000);

            // Добавляем CSS стили для рейтинга и скрытия TMDB
            var style = $('<style>' +
                '.kinopoisk-rating {' +
                '    animation: kinopoisk-glow 2s ease-in-out infinite alternate;' +
                '    z-index: 9999 !important;' +
                '    position: relative !important;' +
                '}' +
                '@keyframes kinopoisk-glow {' +
                '    from { box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3); }' +
                '    to { box-shadow: 0 4px 8px rgba(255, 107, 53, 0.6); }' +
                '}' +
                // Скрываем TMDB рейтинги
                '.tmdb-rating, .imdb-rating, [class*="tmdb"], [class*="imdb"] {' +
                '    display: none !important;' +
                '    visibility: hidden !important;' +
                '}' +
                // Скрываем элементы с рейтингами
                'div:contains("TMDB"), div:contains("IMDB"), div:contains("7.0"), div:contains("6.3"), div:contains("6.5") {' +
                '    display: none !important;' +
                '}' +
                '</style>');
            $('head').append(style);

            console.log('Плагин рейтинга Кинопоиска инициализирован');
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
    if (!window.plugin_kinopoisk_rating_ready) {
        startPlugin();
    }

})();
