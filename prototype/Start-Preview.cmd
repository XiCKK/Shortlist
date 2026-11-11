@echo off
cd /d "%~dp0"
echo Opening Shortlist at http://127.0.0.1:4173
echo Keep this window open while trying the prototype.
start "" "http://127.0.0.1:4173"
node server.mjs
pause
