#!/usr/bin/env python3
"""
英语学习记录本地服务器
支持自动执行 learn-english 命令
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import subprocess
import json
import os
import urllib.parse

class EnglishLearningHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # 处理 CORS
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        # 处理 CORS
        self.send_response(200)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')

        try:
            data = json.loads(post_data)
            url = data.get('url', '')

            if not url:
                self.wfile.write(json.dumps({
                    'success': False,
                    'error': 'URL is required'
                }).encode())
                return

            # 执行 learn-english 命令
            # 使用 osascript 唤起 Claude Code 并执行命令
            script = f'''tell application "Claude Code" to activate
    delay 0.5
    execute "{"/learn-english {url}"}"
    end tell'''

            result = subprocess.run(
                ['osascript', '-e', script],
                capture_output=True,
                text=True,
                timeout=120  # 2分钟超时
            )

            self.wfile.write(json.dumps({
                'success': True,
                'message': 'Command executed successfully',
                'output': result.stdout,
                'error': result.stderr
            }).encode())

        except subprocess.TimeoutExpired:
            self.wfile.write(json.dumps({
                'success': False,
                'error': 'Command execution timed out'
            }).encode())
        except Exception as e:
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode())

def run_server():
    port = 8001
    server_address = ('', port)
    httpd = HTTPServer(server_address, EnglishLearningHandler)
    print(f"🚀 英语学习服务器运行在 http://localhost:{port}")
    print(f"📡 支持自动执行 learn-english 命令")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
