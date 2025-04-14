@echo off
setlocal enabledelayedexpansion

REM Check if project name is provided
if "%~1"=="" (
    echo Usage: %0 projectName
    exit /b 1
)
set "PROJECT=%~1"
set "ENVFILE=config\.env.%PROJECT%"

REM Check if the .env file exists
if not exist "%ENVFILE%" (
    echo File %ENVFILE% not found.
    exit /b 1
)

REM Parse the .env file for required variables
for /f "tokens=1,* delims==" %%A in ('findstr /r "^VITE_MANIFEST_LOGO192=" "%ENVFILE%"') do (
    set "logo192=%%B"
)
for /f "tokens=1,* delims==" %%A in ('findstr /r "^VITE_MANIFEST_LOGO512=" "%ENVFILE%"') do (
    set "logo512=%%B"
)
for /f "tokens=1,* delims==" %%A in ('findstr /r "^VITE_APP_ICON_URL=" "%ENVFILE%"') do (
    set "appicon=%%B"
)

REM Verify all variables were set
if not defined logo192 (
    echo VITE_MANIFEST_LOGO192 not found.
    exit /b 1
)
if not defined logo512 (
    echo VITE_MANIFEST_LOGO512 not found.
    exit /b 1
)
if not defined appicon (
    echo VITE_APP_ICON_URL not found.
    exit /b 1
)

REM Ensure target directory exists
if not exist "config\%1" (
    mkdir "config\%1"
)

REM Download the files using PowerShell (assuming it is available)
powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%logo192%' -OutFile 'config\%1%\logo192.png'"
powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%logo512%' -OutFile 'config\%1%\logo512.png'"
powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%appicon%' -OutFile 'config\%1%\appicon.png'"

echo Logos downloaded successfully.
