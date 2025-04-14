@REM Copies the contents of the dist folder to the WSL Ubuntu 24.04 home sub folder given as argument 
@xcopy /q /e /y dist\* \\wsl.localhost\Ubuntu-24.04\home\johan\%1\