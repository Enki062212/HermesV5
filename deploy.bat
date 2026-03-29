@echo off
REM Hermes + Exponify Production Deployment Script for Windows

set IMAGE_NAME=hermes-exponify
set VERSION=%1
if "%VERSION%"=="" set VERSION=v1.0.0

set REGISTRY=%2

echo ═══════════════════════════════════════════════════════════════
echo   Hermes + Exponify Production Deployment
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📦 Building production image: %IMAGE_NAME%:%VERSION%
echo.

REM Build production image
docker build --target production -t %IMAGE_NAME%:%VERSION% .

if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

REM Tag with registry if provided
if not "%REGISTRY%"=="" (
    echo.
    echo 🏷️  Tagging for registry: %REGISTRY%
    docker tag %IMAGE_NAME%:%VERSION% %REGISTRY%/%IMAGE_NAME%:%VERSION%
    docker tag %IMAGE_NAME%:%VERSION% %REGISTRY%/%IMAGE_NAME%:latest
    
    echo.
    echo 📤 Pushing to registry...
    docker push %REGISTRY%/%IMAGE_NAME%:%VERSION%
    docker push %REGISTRY%/%IMAGE_NAME%:latest
)

echo.
echo ✅ Build complete!
echo.
echo To run locally:
echo   docker run -d -p 80:80 --name hermes %IMAGE_NAME%:%VERSION%
echo.
if not "%REGISTRY%"=="" (
    echo To deploy to server:
    echo   docker run -d -p 80:80 --name hermes %REGISTRY%/%IMAGE_NAME%:%VERSION%
    echo.
)
