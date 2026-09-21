@echo off
cd /d "%~dp0"
set PORT=4176
start "" http://127.0.0.1:4176/
node serve.cjs
pause
