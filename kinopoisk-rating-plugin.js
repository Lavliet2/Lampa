/**
 * Плагин рейтинга Кинопоиска для Lampa
 * Заменяет рейтинг TMDB на обложках фильмов на рейтинг Кинопоиска
 * Внутри фильма TMDB рейтинги остаются без изменений
 * 
 * API ключ: W8MH17J-1KP4DFN-KFPG9JZ-8GZYGBN
 * API: https://api.kinopoisk.dev
 * 
 * Особенности:
 * - Получает РЕАЛЬНЫЕ рейтинги с API Кинопоиска
 * - Fallback: 0.1 (если фильм не найден или API недоступен)
 * - НЕ использует кэши и моки
 * - Позиционирование в верхнем левом углу обложки
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_kinopoisk_rating_ready = true;

        function add() {
            // Функция для получения рейтинга с Кинопоиска
            function getKinopoiskRating(movieTitle) {
                console.log('🌐 Запрос к API Кинопоиска для:', movieTitle);
                var searchQuery = encodeURIComponent(movieTitle);
                var apiUrl = 'https://api.kinopoisk.dev/v1.4/movie/search?query=' + searchQuery + '&page=1&limit=1';
                
                var xhr = new XMLHttpRequest();
                xhr.open('GET', apiUrl, true);
                xhr.setRequestHeader('X-API-KEY', 'W8MH17J-1KP4DFN-KFPG9JZ-8GZYGBN');
                xhr.setRequestHeader('Accept', 'application/json');
                
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                if (response.docs && response.docs.length > 0) {
                                    var film = response.docs[0];
                                    var rating = film.rating.kp;
                                    
                                    if (rating && rating > 0) {
                                        updateRatingDisplay(rating, film.votes.kp, film.name);
                                        console.log('⭐ Реальный рейтинг Кинопоиска получен:', movieTitle, rating);
                                        return;
                                    }
                                }
                            } catch (e) {
                                console.log('❌ Ошибка парсинга ответа API:', e);
                            }
                        } else {
                            console.log('❌ Ошибка API:', xhr.status, xhr.statusText);
                        }
                        
                        // В случае ошибки или если фильм не найден - показываем 0.1
                        showFallbackRating(movieTitle);
                    }
                };
                
                xhr.onerror = function() {
                    console.log('❌ Ошибка сети при запросе к API');
                    showFallbackRating(movieTitle);
                };
                
                xhr.send();
            }
            
            // Функция для fallback (0.1)
            function showFallbackRating(movieTitle) {
                console.log('📊 Fallback рейтинг (0.1):', movieTitle);
                updateRatingDisplay('0.1', 0, movieTitle);
            }

            // Безопасное обновление отображения рейтинга на обложках
            function updateRatingDisplay(rating, votes, filmName) {
                // Создаем красивый рейтинг Кинопоиска для обложек
                var kinopoiskRating = $('<div class="kinopoisk-rating" style="' +
                    'position: absolute; ' +
                    'top: 8px; ' +
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
                    '<span style="font-weight: bold;">' + rating + '</span>' +
                    '</div>');

                // Добавляем рейтинг на карточки фильмов
                setTimeout(function() {
                    $('.card').each(function() {
                        var card = $(this);
                        if (!card.find('.kinopoisk-rating').length) {
                            card.css('position', 'relative');
                            card.append(kinopoiskRating.clone());
                        }
                    });
                }, 500);
            }

            // Добавление рейтинга Кинопоиска на карточки
            function addKinopoiskRatingToCards() {
                console.log('Поиск карточек для добавления рейтинга Кинопоиска...');
                
                $('.card').each(function() {
                    var card = $(this);
                    var movieTitle = '';
                    
                    // Ищем название фильма из карточки
                    card.find('*').each(function() {
                        var element = $(this);
                        var text = element.text().trim();
                        // Ищем название фильма (обычно это самый длинный текст)
                        if (text.length > 10 && text.length < 50 && !text.match(/^\d+\.\d+$/)) {
                            movieTitle = text;
                            return false;
                        }
                    });
                    
                    // Если еще нет рейтинга Кинопоиска на карточке
                    if (!card.find('.kinopoisk-rating').length) {
                        if (movieTitle) {
                            console.log('🎬 Найден фильм для запроса:', movieTitle);
                            getKinopoiskRating(movieTitle);
                        } else {
                            console.log('❓ Название фильма не найдено, показываем 0.1');
                            showFallbackRating('Неизвестный фильм');
                        }
                    }
                });
            }

            // Слушаем события загрузки карточек фильмов (главное меню)
            Lampa.Listener.follow('card', function (e) {
                if (e.type == 'complite') {
                    // Добавляем рейтинг Кинопоиска
                    setTimeout(function() {
                        addKinopoiskRatingToCards();
                    }, 1000);
                }
            });

            // Периодически добавляем рейтинги Кинопоиска на обложки
            setInterval(function() {
                addKinopoiskRatingToCards();
            }, 5000);

            // Также добавляем сразу при загрузке
            setTimeout(function() {
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
    if (!window.plugin_kinopoisk_rating_ready) {
        startPlugin();
    }

})();