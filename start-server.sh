#!/bin/bash

# 英语学习查看器 - 本地服务器启动脚本

echo "🚀 正在启动英语学习查看器..."
echo ""
echo "服务器地址: http://localhost:8000"
echo "按 Ctrl+C 停止服务器"
echo ""

cd ~/english-learning
python3 -m http.server 8000
