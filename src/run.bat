@echo off
echo Starting 5 bot instances

for /L %%i in (1,1,5) do start "" /B node main.js