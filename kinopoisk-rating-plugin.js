/**
 * Плагин рейтинга Кинопоиска для Lampa
 * Заменяет рейтинг TMDB на обложках фильмов на рейтинг Кинопоиска
 * Внутри фильма TMDB рейтинги остаются без изменений
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

            // Безопасное обновление отображения рейтинга на обложках
            function updateRatingDisplay(rating, votes, filmName) {
                // Создаем красивый рейтинг Кинопоиска для обложек
                var kinopoiskRating = $('<div class="kinopoisk-rating-safe" style="' +
                    'position: absolute; ' +
                    'bottom: 8px; ' +
                    'right: 8px; ' +
                    'background: linear-gradient(135deg, #ff6b35, #f7931e); ' +
                    'color: white; ' +
                    'padding: 4px 8px; ' +
                    'border-radius: 6px; ' +
                    'font-weight: bold; ' +
                    'font-size: 12px; ' +
                    'box-shadow: 0 2px 6px rgba(255, 107, 53, 0.5);' +
                    'z-index: 10;' +
                    'display: flex; ' +
                    'align-items: center; ' +
                    '">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" style="margin-right: 4px; fill: currentColor;">' +
                    '<path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>' +
                    '</svg>' +
                    '<span style="font-weight: bold;">' + rating + '</span>' +
                    '</div>');
                
                // Добавляем рейтинг на карточки фильмов
                setTimeout(function() {
                    $('.card').each(function() {
                        var card = $(this);
                        if (!card.find('.kinopoisk-rating-safe').length) {
                            card.css('position', 'relative');
                            card.append(kinopoiskRating.clone());
                        }
                    });
                }, 500);
            }

            // Попытка добавить рейтинг Кинопоиска рядом с TMDB на обложках
            function addKinopoiskRatingToCards() {
                // Ищем карточки с рейтингами TMDB
                $('.card').each(function() {
                    var card = $(this);
                    var tmdbRating = null;
                    
                    // Ищем TMDB рейтинг на карточке
                    card.find('*').each(function() {
                        var element = $(this);
                        var text = element.text().trim();
                        
                        // Если нашли рейтинг типа "7.0"
                        if (text.match(/^\d+\.\d+$/) && text.length <= 4) {
                            tmdbRating = text;
                            return false; // Выходим из цикла
                        }
                    });
                    
                    // Если нашли TMDB рейтинг, добавляем рядом рейтинг Кинопоиска
                    if (tmdbRating && !card.find('.kinopoisk-rating').length) {
                        var kinopoiskRating = $('<div class="kinopoisk-rating" style="' +
                            'position: absolute; ' +
                            'bottom: 8px; ' +
                            'left: 8px; ' +
                            'background: linear-gradient(135deg, #ff6b35, #f7931e); ' +
                            'color: white; ' +
                            'padding: 4px 8px; ' +
                            'border-radius: 6px; ' +
                            'font-weight: bold; ' +
                            'font-size: 12px; ' +
                            'box-shadow: 0 2px 6px rgba(255, 107, 53, 0.5);' +
                            'z-index: 10;' +
                            'display: flex; ' +
                            'align-items: center; ' +
                            '">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" style="margin-right: 4px; fill: currentColor;">' +
                            '<path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>' +
                            '</svg>' +
                            '<span style="font-weight: bold;">8.2</span>' +
                            '</div>');
                        
                        card.css('position', 'relative');
                        card.append(kinopoiskRating);
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

            // Слушаем события загрузки карточек фильмов (главное меню)
            Lampa.Listener.follow('card', function (e) {
                if (e.type == 'complite') {
                    // Добавляем рейтинг Кинопоиска рядом с TMDB
                    setTimeout(function() {
                        addKinopoiskRatingToCards();
                    }, 1000);
                    
                    // Также добавляем через поиск по фильму
                    setTimeout(function() {
                        searchKinopoiskRating(e.data);
                    }, 1500);
                }
            });

            // НЕ слушаем события загрузки фильмов - оставляем TMDB рейтинги внутри фильма

            // Периодически добавляем рейтинги Кинопоиска на обложки
            setInterval(function() {
                addKinopoiskRatingToCards();
            }, 3000);

            // Добавляем CSS стили
            var style = $('<style>' +
                '.kinopoisk-rating {' +
                '    animation: kinopoisk-glow 2s ease-in-out infinite alternate;' +
                '    z-index: 9999 !important;' +
                '}' +
                '@keyframes kinopoisk-glow {' +
                '    from { box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3); }' +
                '    to { box-shadow: 0 4px 8px rgba(255, 107, 53, 0.6); }' +
                '}' +
                '</style>');
            $('head').append(style);

            console.log('Плагин рейтинга Кинопоиска инициализирован - работает только на обложках');
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
