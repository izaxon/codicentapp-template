@REM Sets given target 
@echo %1 > build_target
@copy config\%1\appicon.png public\images\appicon.png >nul
@copy config\%1\logo192.png public\images\logo192.png >nul
@copy config\%1\logo512.png public\images\logo512.png >nul
@REM Copy embeddedapp folder from config if it exists (remove pre-existing folder first)
@rd /S /Q public\app >nul
@xcopy config\%1\app public\app /E /I /Y >nul
