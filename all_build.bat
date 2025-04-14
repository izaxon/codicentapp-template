@REM Builds all versions  
@REM call getlogos elpress
call build elpress
call dint elpress
@REM call getlogos factor
call build factor
@xcopy /q /e /y dist\* \\wsl.localhost\Ubuntu-24.04\home\johan\factor
@REM call getlogos hellofresh
call build hellofresh
@xcopy /q /e /y dist\* \\wsl.localhost\Ubuntu-24.04\home\johan\hellofreshapp
@REM call getlogos recipful
call build recipful
call dint recipful
@xcopy /q /e /y dist\* ..\recipful.se\app\
@REM call getlogos swedsleep
call build swedsleep
call dint swedsleep
@REM call getlogos codicent
call build codicent
call dint codicent
@REM call getlogos balzac
call build balzac
call dint balzac
@REM call getlogos hantverksdesign
call build hantverksdesign
call dint hantverksdesign
@REM call getlogos tool4u
call build tool4u
call dint tool4u
@REM call getlogos hwadvokatbyra
call build hwadvokatbyra
call dint hwadvokatbyra

