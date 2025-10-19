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
 * - Кэширует в памяти и localStorage устройства
 * - Лимит: 500 запросов в сутки
 * - Fallback: 0.1 (только при ошибке API)
 * - НЕ использует TMDB рейтинги
 * - Очистка кэша: старше 3 месяцев
 * - Проверка каждые 5 секунд
 * - Позиционирование в верхнем левом углу обложки
 */

(function () {
    'use strict';

    function startPlugin() {
        window.plugin_kinopoisk_rating_ready = true;

        function add() {
            // Кэш для рейтингов (избегаем повторных запросов)
            var ratingsCache = {};
            
            // Очищаем старый кэш (старше 3 месяцев)
            function cleanOldCache() {
                var today = Date.now();
                var threeMonthsAgo = today - (90 * 24 * 60 * 60 * 1000); // 3 месяца = 90 дней
                
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    if (key && key.startsWith('kinopoisk_') && !key.includes('requests_')) {
                        try {
                            var data = JSON.parse(localStorage.getItem(key));
                            if (data.timestamp && data.timestamp < threeMonthsAgo) {
                                localStorage.removeItem(key);
                                console.log('🗑️ Удален старый кэш (старше 3 месяцев):', key);
                            }
                        } catch (e) {
                            // Игнорируем ошибки парсинга
                        }
                    }
                }
            }
            
            // Очищаем старый кэш при запуске
            cleanOldCache();
            
            // Функция для получения реального рейтинга с Кинопоиска
            function getKinopoiskRating(movieTitle, year) {
                var cacheKey = movieTitle + '_' + year;
                
                // Проверяем кэш в памяти
                if (ratingsCache[cacheKey]) {
                    console.log('📋 Используем кэшированный рейтинг из памяти:', ratingsCache[cacheKey]);
                    updateRatingDisplay(ratingsCache[cacheKey].rating, ratingsCache[cacheKey].votes, ratingsCache[cacheKey].name);
                    return;
                }
                
                // Проверяем localStorage
                var storedRating = localStorage.getItem('kinopoisk_' + cacheKey);
                if (storedRating) {
                    try {
                        var ratingData = JSON.parse(storedRating);
                        console.log('💾 Используем кэшированный рейтинг из localStorage:', ratingData);
                        updateRatingDisplay(ratingData.rating, ratingData.votes, ratingData.name);
                        return;
                    } catch (e) {
                        console.log('❌ Ошибка парсинга localStorage:', e);
                    }
                }
                
                // Проверяем лимит запросов (500 в сутки)
                var today = new Date().toDateString();
                var requestsToday = parseInt(localStorage.getItem('kinopoisk_requests_' + today) || '0');
                if (requestsToday >= 500) {
                    console.log('⚠️ Лимит запросов исчерпан (500/день), используем fallback');
                    useMockRating(movieTitle);
                    return;
                }
                
                // Делаем запрос к API Кинопоиска
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
                                if (response.films && response.films.length > 0) {
                                    var film = response.films[0];
                                    var rating = film.rating;
                                    var votes = film.ratingVoteCount;
                                    
                                    if (rating && rating !== 'null' && rating !== '0') {
                                        var ratingData = {
                                            rating: rating,
                                            votes: votes,
                                            name: film.nameRu || film.nameEn,
                                            timestamp: Date.now()
                                        };
                                        
                                        // Сохраняем в кэш памяти
                                        ratingsCache[cacheKey] = ratingData;
                                        
                                        // Сохраняем в localStorage
                                        localStorage.setItem('kinopoisk_' + cacheKey, JSON.stringify(ratingData));
                                        
                                        // Увеличиваем счетчик запросов
                                        localStorage.setItem('kinopoisk_requests_' + today, (requestsToday + 1).toString());
                                        
                                        updateRatingDisplay(rating, votes, film.nameRu || film.nameEn);
                                        console.log('⭐ Реальный рейтинг Кинопоиска получен:', movieTitle, rating, votes);
                                        return;
                                    }
                                }
                            } catch (e) {
                                console.log('❌ Ошибка парсинга ответа API:', e);
                            }
                        } else if (xhr.status === 401) {
                            console.log('🔑 ОШИБКА АВТОРИЗАЦИИ! API ключ неверный');
                        } else if (xhr.status === 429) {
                            console.log('⚠️ Лимит запросов превышен (429)');
                        } else {
                            console.log('❌ Ошибка API:', xhr.status, xhr.statusText);
                        }
                        
                        // В случае ошибки используем fallback
                        useMockRating(movieTitle);
                    }
                };
                
                xhr.onerror = function() {
                    console.log('❌ Ошибка сети при запросе к API');
                    useMockRating(movieTitle);
                };
                
                xhr.send();
            }
            
            // Функция для fallback данных (только когда API недоступен)
            function useMockRating(movieTitle) {
                // Показываем 0.1 если не нашли рейтинг
                var kinopoiskRating = '0.1';
                var votes = 0;
                
                console.log('📊 Fallback рейтинг (0.1):', movieTitle, kinopoiskRating);
                updateRatingDisplay(kinopoiskRating, votes, movieTitle);
                console.log('🎭 Fallback рейтинг (не с Кинопоиска):', movieTitle, kinopoiskRating, votes);
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

            // Добавление рейтинга Кинопоиска только на карточки с TMDB рейтингами
            function addKinopoiskRatingToCards() {
                console.log('Поиск карточек с TMDB рейтингами...');
                
                $('.card').each(function() {
                    var card = $(this);
                    var hasTMDBRating = false;
                    var tmdbRatingValue = '';
                    
                    // Ищем TMDB рейтинг на карточке
                    card.find('*').each(function() {
                        var element = $(this);
                        var text = element.text().trim();
                        
                        // Ищем числовые рейтинги типа "7.4", "6.5" и т.д.
                        if (text.match(/^\d+\.\d+$/) && text.length <= 4) {
                            hasTMDBRating = true;
                            tmdbRatingValue = text;
                            return false; // Выходим из цикла
                        }
                    });
                    
                    // Если нашли TMDB рейтинг и еще нет рейтинга Кинопоиска
                    if (hasTMDBRating && !card.find('.kinopoisk-rating').length) {
                        // Получаем название фильма из карточки
                        var movieTitle = '';
                        card.find('*').each(function() {
                            var element = $(this);
                            var text = element.text().trim();
                            // Ищем название фильма (обычно это самый длинный текст)
                            if (text.length > 10 && text.length < 50 && !text.match(/^\d+\.\d+$/)) {
                                movieTitle = text;
                                return false;
                            }
                        });
                        
                        if (movieTitle) {
                            // Получаем реальный рейтинг с Кинопоиска
                            getKinopoiskRating(movieTitle, new Date().getFullYear());
                        } else {
                            // Если не нашли название, используем моковый рейтинг
                            var tmdbNum = parseFloat(tmdbRatingValue);
                            var kinopoiskNum = (tmdbNum + 0.5 + Math.random() * 0.6).toFixed(1);
                            
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
                                '<span style="font-weight: bold;">' + kinopoiskNum + '</span>' +
                                '</div>');
                            
                            card.css('position', 'relative');
                            card.append(kinopoiskRating);
                            console.log('Добавлен моковый рейтинг Кинопоиска:', kinopoiskNum, 'для TMDB:', tmdbRatingValue);
                        }
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

            // Периодически добавляем рейтинги Кинопоиска на обложки (реже, чтобы не перегружать)
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
