/**
 * Безопасный плагин рейтинга Кинопоиска для Lampa
 * Более мягкое скрытие TMDB рейтингов
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_kinopoisk_safe_ready = true;

        function add() {
            // Функция для получения рейтинга (моковые данные)
            function getKinopoiskRating(movieTitle, year) {
                var mockRatings = {
                    'заклятие': { rating: '8.2', votes: '125000' },
                    'аватар': { rating: '8.8', votes: '89000' },
                    'интерстеллар': { rating: '8.6', votes: '156000' },
                    'матрица': { rating: '8.7', votes: '234000' },
                    'титаник': { rating: '7.8', votes: '189000' }
                };
                
                var titleLower = movieTitle.toLowerCase();
                var foundRating = null;
                
                for (var key in mockRatings) {
                    if (titleLower.includes(key)) {
                        foundRating = mockRatings[key];
                        break;
                    }
                }
                
                if (!foundRating) {
                    var randomRating = (Math.random() * 3 + 6).toFixed(1);
                    var randomVotes = Math.floor(Math.random() * 200000 + 50000);
                    foundRating = { rating: randomRating, votes: randomVotes };
                }
                
                updateRatingDisplay(foundRating.rating, foundRating.votes, movieTitle);
                console.log('Рейтинг Кинопоиска:', movieTitle, foundRating.rating, foundRating.votes);
            }

            // Безопасное обновление отображения рейтинга
            function updateRatingDisplay(rating, votes, filmName) {
                // Создаем красивый рейтинг Кинопоиска
                var kinopoiskRating = $('<div class="kinopoisk-rating-safe" style="' +
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
                
                // Добавляем рейтинг в безопасные места
                setTimeout(function() {
                    $('.full__info, .card__info').append(kinopoiskRating);
                }, 500);
            }

            // Мягкое скрытие TMDB рейтингов
            function hideTMDBRatings() {
                // Скрываем только конкретные элементы с рейтингами
                $('.tmdb-rating, .imdb-rating').hide();
                
                // Ищем элементы с рейтингами и скрываем их аккуратно
                $('div').each(function() {
                    var element = $(this);
                    var text = element.text().trim();
                    
                    // Скрываем только если это явно рейтинг
                    if (text.match(/^\d+\.\d+\s*(TMDB|IMDB)$/i)) {
                        element.hide();
                    }
                });
            }

            // Функция для поиска рейтинга по фильму
            function searchKinopoiskRating(data) {
                if (data && data.movie) {
                    var title = data.movie.title || data.movie.original_title;
                    var year = data.movie.year || new Date().getFullYear();
                    
                    if (title) {
                        console.log('Поиск рейтинга для:', title, year);
                        getKinopoiskRating(title, year);
                    }
                }
            }

            // Слушаем события загрузки фильмов
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // Мягкое скрытие TMDB рейтингов
                    setTimeout(function() {
                        hideTMDBRatings();
                    }, 1000);
                    
                    // Поиск рейтинга Кинопоиска
                    setTimeout(function() {
                        searchKinopoiskRating(e.data);
                    }, 2000);
                }
            });

            // Добавляем CSS стили
            var style = $('<style>' +
                '.kinopoisk-rating-safe {' +
                '    animation: kinopoisk-glow 2s ease-in-out infinite alternate;' +
                '    z-index: 9999 !important;' +
                '}' +
                '@keyframes kinopoisk-glow {' +
                '    from { box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3); }' +
                '    to { box-shadow: 0 4px 8px rgba(255, 107, 53, 0.6); }' +
                '}' +
                '</style>');
            $('head').append(style);

            console.log('Безопасный плагин рейтинга Кинопоиска инициализирован');
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
    if (!window.plugin_kinopoisk_safe_ready) {
        startPlugin();
    }

})();
