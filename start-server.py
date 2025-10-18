#!/usr/bin/env python3
"""
Простой HTTP сервер для разработки плагинов Lampa
Запустите этот скрипт и откройте http://localhost:8000/plugin-loader.html
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Настройки сервера
PORT = 8000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Добавляем CORS заголовки для работы с Lampa
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        # Обработка preflight запросов
        self.send_response(200)
        self.end_headers()

def start_server():
    """Запуск HTTP сервера"""
    # Переходим в директорию проекта
    os.chdir(Path(__file__).parent)
    
    # Создаем сервер
    with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 HTTP сервер запущен на http://{HOST}:{PORT}")
        print(f"📁 Рабочая директория: {os.getcwd()}")
        print(f"🔌 Загрузчик плагинов: http://{HOST}:{PORT}/plugin-loader.html")
        print("\n📋 Доступные файлы:")
        
        # Показываем доступные файлы
        for file in os.listdir('.'):
            if file.endswith(('.js', '.html', '.md')):
                print(f"   - {file}")
        
        print(f"\n🌐 Открываем браузер...")
        webbrowser.open(f'http://{HOST}:{PORT}/plugin-loader.html')
        
        print(f"\n⏹️  Для остановки сервера нажмите Ctrl+C")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Сервер остановлен")

if __name__ == "__main__":
    start_server()
