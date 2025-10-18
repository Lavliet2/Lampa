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
                // Ищем элементы с рейтингом TMDB
                var ratingElements = $('.card__rating, .full__rating, .rating, .tmdb-rating');
                
                ratingElements.each(function() {
                    var element = $(this);
                    
                    // Создаем новый элемент с рейтингом Кинопоиска
                    var kinopoiskRating = $('<div class="kinopoisk-rating" style="' +
                        'display: inline-flex; ' +
                        'align-items: center; ' +
                        'background: linear-gradient(135deg, #ff6b35, #f7931e); ' +
                        'color: white; ' +
                        'padding: 4px 8px; ' +
                        'border-radius: 6px; ' +
                        'font-weight: bold; ' +
                        'font-size: 12px; ' +
                        'margin-left: 8px; ' +
                        'box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);' +
                        '">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style="margin-right: 4px; fill: currentColor;">' +
                        '<path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>' +
                        '</svg>' +
                        'КП: ' + rating + 
                        '<span style="font-size: 10px; margin-left: 4px; opacity: 0.8;">(' + votes + ')</span>' +
                        '</div>');
                    
                    // Заменяем или добавляем рейтинг
                    element.after(kinopoiskRating);
                });
                
                console.log('Рейтинг Кинопоиска обновлен:', filmName, rating, votes);
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

            // Слушаем события загрузки фильмов
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    // Небольшая задержка для загрузки интерфейса
                    setTimeout(function() {
                        searchKinopoiskRating(e.data);
                    }, 1000);
                }
            });

            // Слушаем события карточек фильмов
            Lampa.Listener.follow('card', function (e) {
                if (e.type == 'complite') {
                    setTimeout(function() {
                        searchKinopoiskRating(e.data);
                    }, 500);
                }
            });

            // Добавляем CSS стили для рейтинга
            var style = $('<style>' +
                '.kinopoisk-rating {' +
                '    animation: kinopoisk-glow 2s ease-in-out infinite alternate;' +
                '}' +
                '@keyframes kinopoisk-glow {' +
                '    from { box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3); }' +
                '    to { box-shadow: 0 4px 8px rgba(255, 107, 53, 0.6); }' +
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
