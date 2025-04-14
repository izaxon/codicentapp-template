@REM Builds app for production with given target 
@call target %1
@setlocal EnableDelayedExpansion
@REM Format date and time to YYYY-MM-DD.HH
@set "VITE_APP_VERSION=%date%.%time:~0,2%" 
@echo ***************************************************
@echo * Building %1
@echo * Version: !VITE_APP_VERSION!
@echo ***************************************************
@npm run build