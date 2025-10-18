/**
 * Плагин рейтинга Кинопоиска для Lampa
 * Заменяет рейтинг TMDB на рейтинг с сайта Кинопоиск
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_kinopoisk_rating_ready = true;

        function add() {
            // Функция для получения рейтинга с Кинопоиска
            function getKinopoiskRating(movieTitle, year) {
                // Используем API Кинопоиска через прокси
                var searchQuery = encodeURIComponent(movieTitle + ' ' + year);
                var apiUrl = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=' + searchQuery + '&page=1';
                
                // Создаем запрос к API
                var xhr = new XMLHttpRequest();
                xhr.open('GET', apiUrl, true);
                xhr.setRequestHeader('X-API-KEY', '8c8e1a50-6322-4135-8875-5d40a54cc9c9'); // Публичный API ключ
                xhr.setRequestHeader('Content-Type', 'application/json');
                
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        try {
                            var response = JSON.parse(xhr.responseText);
                            if (response.films && response.films.length > 0) {
                                var film = response.films[0];
                                var rating = film.rating;
                                var votes = film.ratingVoteCount;
                                
                                if (rating && rating !== 'null') {
                                    updateRatingDisplay(rating, votes, film.nameRu || film.nameEn);
                                }
                            }
                        } catch (e) {
                            console.log('Ошибка парсинга ответа Кинопоиска:', e);
                        }
                    }
                };
                
                xhr.onerror = function() {
                    console.log('Ошибка запроса к Кинопоиску');
                };
                
                xhr.send();
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
                // Скрываем все элементы с рейтингами TMDB
                $('*').each(function() {
                    var element = $(this);
                    var text = element.text();
                    
                    // Проверяем на наличие TMDB рейтингов
                    if (text.includes('TMDB') || 
                        text.includes('7.0') || 
                        text.includes('6.3') || 
                        text.includes('6.5') ||
                        text.includes('IMDB')) {
                        element.hide();
                    }
                });
                
                // Скрываем элементы по классам
                $('.tmdb-rating, .imdb-rating, [class*="tmdb"], [class*="imdb"]').hide();
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
