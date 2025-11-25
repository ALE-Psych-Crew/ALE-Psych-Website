@echo off
setlocal
pushd "%~dp0"

if not exist "node_modules" (
  echo Installing wiki build dependencies...
  npm install --quiet
)

node "js\wiki\wiki.build.js"
if errorlevel 1 (
  echo Wiki build failed.
  popd
  exit /b %errorlevel%
)

echo Wiki build completed.
popd
endlocal
