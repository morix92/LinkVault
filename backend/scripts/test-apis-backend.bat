
@echo off
cd /d "%~dp0"
setlocal EnableExtensions DisableDelayedExpansion
title Backend API - Integration Tests

REM ==================================================
REM CONFIGURATION
REM ==================================================

set "BASE=http://localhost:3000/api"

set "RESP=%TEMP%\backend_response.json"
set "STATUS=%TEMP%\backend_status.txt"
set "TMPFILE=%TEMP%\backend_extracted.txt"

set "PASS=0"
set "FAIL=0"

if not exist reports mkdir reports

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set TIMESTAMP=%%i

set "REPORT=reports\backend-test-%TIMESTAMP%.log"

set "USER_A=autotest_A_%RANDOM%_%RANDOM%"
set "USER_B=autotest_B_%RANDOM%_%RANDOM%"

set "PASS_A=TestPassword123"
set "PASS_B=TestPassword123"

echo.
echo ==================================================
echo          BACKEND API INTEGRATION TESTS
echo ==================================================

echo ================================================== > "%REPORT%"
echo          LINKVAULT BACKEND TEST REPORT >> "%REPORT%"
echo ================================================== >> "%REPORT%"
echo Data: %DATE% %TIME% >> "%REPORT%"
echo. >> "%REPORT%"

REM ==================================================
REM 1. REGISTER
REM ==================================================

call :section "[1] REGISTER USERS A & USER B"

set "BODY={\"username\":\"%USER_A%\",\"password\":\"%PASS_A%\"}"
call :request POST "%BASE%/auth/register" "%BODY%" "" 201
call :request POST "%BASE%/auth/register" "%BODY%" "" 400

set "BODY={\"username\":\"%USER_B%\",\"password\":\"%PASS_B%\"}"
call :request POST "%BASE%/auth/register" "%BODY%" "" 201

REM ==================================================
REM 2. LOGIN A
REM ==================================================

call :section "[2] LOGIN USER A"

set "BODY={\"username\":\"%USER_A%\",\"password\":\"%PASS_A%\"}"
call :request POST "%BASE%/auth/login" "%BODY%" "" 200

del "%TMPFILE%" >nul 2>&1

powershell.exe -NoProfile -Command ^
 "$j=Get-Content -Raw '%RESP%' | ConvertFrom-Json; if($j.token){[IO.File]::WriteAllText('%TMPFILE%', [string]$j.token)}"

if not exist "%TMPFILE%" goto fatal_token_a

set /p TOKEN_A=<"%TMPFILE%"
del "%TMPFILE%" >nul 2>&1

if not defined TOKEN_A goto fatal_token_a

echo JWT A retrieved successfully.

REM ==================================================
REM 3. LOGIN B
REM ==================================================

call :section "[3] LOGIN USER B"

set "BODY={\"username\":\"%USER_B%\",\"password\":\"%PASS_B%\"}"
call :request POST "%BASE%/auth/login" "%BODY%" "" 200

del "%TMPFILE%" >nul 2>&1

powershell.exe -NoProfile -Command ^
 "$j=Get-Content -Raw '%RESP%' | ConvertFrom-Json; if($j.token){[IO.File]::WriteAllText('%TMPFILE%', [string]$j.token)}"

if not exist "%TMPFILE%" goto fatal_token_b

set /p TOKEN_B=<"%TMPFILE%"
del "%TMPFILE%" >nul 2>&1

if not defined TOKEN_B goto fatal_token_b

echo JWT B retrieved successfully.

REM ==================================================
REM 4. GET ME
REM ==================================================

call :section "[4] GET ME"

call :request GET "%BASE%/users/me" "" "%TOKEN_A%" 200
call :assert_contains "%USER_A%"

call :request GET "%BASE%/users/me" "" "%TOKEN_B%" 200
call :assert_contains "%USER_B%"

REM ==================================================
REM 5. AUTHENTICATION
REM ==================================================

call :section "[5] AUTHENTICATION TESTS"

call :request GET "%BASE%/categories" "" "" 401
call :request GET "%BASE%/links" "" "" 401

REM ==================================================
REM 6. CREATE CATEGORIES
REM ==================================================

call :section "[6] CREATE CATEGORIES"

set "BODY={\"name\":\"DIAG_CATEGORY_A\"}"
call :request POST "%BASE%/categories" "%BODY%" "%TOKEN_A%" 201
call :request POST "%BASE%/categories" "%BODY%" "%TOKEN_A%" 400

set "BODY={\"name\":\"DIAG_CATEGORY_B\"}"
call :request POST "%BASE%/categories" "%BODY%" "%TOKEN_B%" 201

REM ==================================================
REM 7. FIND CATEGORY A ID
REM ==================================================

call :section "[7] RETRIEVE CATEGORY A ID"

call :request GET "%BASE%/categories" "" "%TOKEN_A%" 200

call :assert_contains "DIAG_CATEGORY_A"
call :assert_contains "Default"
call :assert_not_contains "DIAG_CATEGORY_B"

set "SEARCH_NAME=DIAG_CATEGORY_A"
set "SEARCH_FIELD=name"

call :findid

if not exist "%TMPFILE%" goto fatal_cat_a

set /p CAT_A_ID=<"%TMPFILE%"
del "%TMPFILE%" >nul 2>&1

if not defined CAT_A_ID goto fatal_cat_a

echo CATEGORY A ID: %CAT_A_ID%

REM ==================================================
REM 8. FIND CATEGORY B ID
REM ==================================================

call :section "[8] RETRIEVE CATEGORY B ID"

call :request GET "%BASE%/categories" "" "%TOKEN_B%" 200
call :assert_contains "Default"

call :assert_contains "DIAG_CATEGORY_B"
call :assert_not_contains "DIAG_CATEGORY_A"

set "SEARCH_NAME=DIAG_CATEGORY_B"
set "SEARCH_FIELD=name"

call :findid

if not exist "%TMPFILE%" goto fatal_cat_b

set /p CAT_B_ID=<"%TMPFILE%"
del "%TMPFILE%" >nul 2>&1

if not defined CAT_B_ID goto fatal_cat_b

echo CATEGORY B ID: %CAT_B_ID%

REM ==================================================
REM 9. CATEGORY OWNERSHIP
REM ==================================================

call :section "[9] CATEGORY OWNERSHIP"

set "BODY={\"name\":\"HACKED_CATEGORY\"}"

call :request PUT "%BASE%/categories/%CAT_B_ID%" "%BODY%" "%TOKEN_A%" 400

call :request DELETE "%BASE%/categories/%CAT_B_ID%" "" "%TOKEN_A%" 404

REM ==================================================
REM 10. CROSS USER CATEGORY LINK
REM ==================================================

call :section "[10] CROSS USER CATEGORY LINK"

set "BODY={\"title\":\"INVALID_LINK\",\"url\":\"https://nodejs.org\",\"categoryId\":%CAT_B_ID%}"

call :request POST "%BASE%/links" "%BODY%" "%TOKEN_A%" 400

call :section "[10B] CREATE LINK WITH DEFAULT CATEGORY"

set "BODY={\"title\":\"DEFAULT_LINK\",\"url\":\"https://github.com\"}"
call :request POST "%BASE%/links" "%BODY%" "%TOKEN_A%" 201


REM ==================================================
REM 11. CREATE LINKS
REM ==================================================

call :section "[11] CREATE LINKS"

set "BODY={\"title\":\"DIAG_LINK_A\",\"url\":\"https://nodejs.org\",\"categoryId\":%CAT_A_ID%}"

call :request POST "%BASE%/links" "%BODY%" "%TOKEN_A%" 201

set "BODY={\"title\":\"DIAG_LINK_B\",\"url\":\"https://angular.dev\",\"categoryId\":%CAT_B_ID%}"

call :request POST "%BASE%/links" "%BODY%" "%TOKEN_B%" 201

REM ==================================================
REM 12. FIND LINK A ID
REM ==================================================

call :section "[12] RETRIEVE LINK A ID"

call :request GET "%BASE%/links" "" "%TOKEN_A%" 200

call :assert_contains "DIAG_LINK_A"
call :assert_not_contains "DIAG_LINK_B"

set "SEARCH_NAME=DIAG_LINK_A"
set "SEARCH_FIELD=title"

call :findid

if not exist "%TMPFILE%" goto fatal_link_a

set /p LINK_A_ID=<"%TMPFILE%"
del "%TMPFILE%" >nul 2>&1

if not defined LINK_A_ID goto fatal_link_a

echo LINK A ID: %LINK_A_ID%

REM ==================================================
REM 13. FIND LINK B ID
REM ==================================================

call :section "[13] RETRIEVE LINK B ID"

call :request GET "%BASE%/links" "" "%TOKEN_B%" 200

call :assert_contains "DIAG_LINK_B"
call :assert_not_contains "DIAG_LINK_A"

set "SEARCH_NAME=DIAG_LINK_B"
set "SEARCH_FIELD=title"

call :findid

if not exist "%TMPFILE%" goto fatal_link_b

set /p LINK_B_ID=<"%TMPFILE%"
del "%TMPFILE%" >nul 2>&1

if not defined LINK_B_ID goto fatal_link_b

echo LINK B ID: %LINK_B_ID%

REM ==================================================
REM 14. LINK OWNERSHIP
REM ==================================================

call :section "[14] LINK OWNERSHIP"

set "BODY={\"title\":\"HACKED_LINK\",\"url\":\"https://evil.com\",\"categoryId\":%CAT_A_ID%}"

call :request PUT "%BASE%/links/%LINK_B_ID%" "%BODY%" "%TOKEN_A%" 400

call :request DELETE "%BASE%/links/%LINK_B_ID%" "" "%TOKEN_A%" 404

REM ==================================================
REM 15. CATEGORY FILTER
REM ==================================================

call :section "[15] FILTER LINKS BY CATEGORY"

call :request GET "%BASE%/links?categoryId=%CAT_A_ID%" "" "%TOKEN_A%" 200

call :assert_contains "DIAG_LINK_A"
call :assert_not_contains "DIAG_LINK_B"

REM ==================================================
REM 16. UPDATE CATEGORY A
REM ==================================================

call :section "[16] UPDATE CATEGORY A"

set "BODY={\"name\":\"DIAG_CATEGORY_A_UPDATED\"}"

call :request PUT "%BASE%/categories/%CAT_A_ID%" "%BODY%" "%TOKEN_A%" 2xx

call :request GET "%BASE%/categories" "" "%TOKEN_A%" 200
call :assert_contains "Default"

call :assert_contains "DIAG_CATEGORY_A_UPDATED"

REM ==================================================
REM 17. UPDATE LINK A
REM ==================================================

call :section "[17] UPDATE LINK A"

set "BODY={\"title\":\"DIAG_LINK_A_UPDATED\",\"url\":\"https://angular.dev\",\"categoryId\":%CAT_A_ID%}"

call :request PUT "%BASE%/links/%LINK_A_ID%" "%BODY%" "%TOKEN_A%" 2xx

call :request GET "%BASE%/links" "" "%TOKEN_A%" 200

call :assert_contains "DIAG_LINK_A_UPDATED"

REM ==================================================
REM 18. DELETE LINK A
REM ==================================================

call :section "[18] DELETE LINK A"

call :request DELETE "%BASE%/links/%LINK_A_ID%" "" "%TOKEN_A%" 2xx

call :request GET "%BASE%/links" "" "%TOKEN_A%" 200

call :assert_not_contains "DIAG_LINK_A_UPDATED"

REM ==================================================
REM 19. DELETE CATEGORY A
REM ==================================================

call :section "[19] DELETE CATEGORY A"

call :request DELETE "%BASE%/categories/%CAT_A_ID%" "" "%TOKEN_A%" 2xx

call :request GET "%BASE%/categories" "" "%TOKEN_A%" 200

call :assert_not_contains "DIAG_CATEGORY_A_UPDATED"

REM ==================================================
REM 20. DELETE USER B
REM ==================================================

call :section "[20] DELETE USER B"

call :request DELETE "%BASE%/users/me" "" "%TOKEN_B%" 2xx

REM ==================================================
REM 21. CHECK JWT AFTER DELETION
REM ==================================================

call :section "[21] JWT AFTER USER DELETION"

call :request GET "%BASE%/users/me" "" "%TOKEN_B%" 401

REM ==================================================
REM 22. UPDATE USER A
REM ==================================================

call :section "[22] UPDATE USER A"

set "BODY={\"username\":\"%USER_A%_UPDATED\",\"password\":\"NewPassword123\"}"

call :request PUT "%BASE%/users/me" "%BODY%" "%TOKEN_A%" 2xx

call :request GET "%BASE%/users/me" "" "%TOKEN_A%" 200

call :assert_contains "%USER_A%_UPDATED"

REM ==================================================
REM REPORT
REM ==================================================

echo.
echo ==================================================
echo                  TEST REPORT
echo ==================================================
echo.
echo PASSED: %PASS%
echo FAILED: %FAIL%
echo.

if "%FAIL%"=="0" (
    echo [SUCCESS] ALL TESTS PASSED
) else (
    echo [WARNING] SOME TESTS FAILED
)

echo.
echo USER A: %USER_A%
echo USER B: %USER_B%
echo.
echo USER B deleted.
echo USER A remains in database.
echo ==================================================


echo. >> "%REPORT%"
echo ================================================== >> "%REPORT%"
echo FINAL REPORT >> "%REPORT%"
echo ================================================== >> "%REPORT%"
echo PASSED: %PASS% >> "%REPORT%"
echo FAILED: %FAIL% >> "%REPORT%"
echo USER A: %USER_A% >> "%REPORT%"
echo USER B: %USER_B% >> "%REPORT%"

goto finish

REM ==================================================
REM SECTION
REM ==================================================

:section

echo.
echo ==================================================
echo %~1
echo ==================================================

echo.>>"%REPORT%"
echo ==================================================>>"%REPORT%"
echo %~1>>"%REPORT%"
echo ==================================================>>"%REPORT%"

exit /b

REM ==================================================
REM HTTP REQUEST
REM ==================================================

:request

set "METHOD=%~1"
set "URL=%~2"
set "DATA=%~3"
set "JWT=%~4"
set "EXPECT=%~5"

echo.
echo --------------------------------------------------
echo %METHOD% %URL%
echo --------------------------------------------------

echo %METHOD% %URL%>>"%REPORT%"

if defined DATA (
    if defined JWT (
        curl.exe -sS -X "%METHOD%" "%URL%" ^
        -H "Authorization: Bearer %JWT%" ^
        -H "Content-Type: application/json" ^
        -d "%DATA%" ^
        -o "%RESP%" -w "%%{http_code}" > "%STATUS%"
    ) else (
        curl.exe -sS -X "%METHOD%" "%URL%" ^
        -H "Content-Type: application/json" ^
        -d "%DATA%" ^
        -o "%RESP%" -w "%%{http_code}" > "%STATUS%"
    )
) else (
    if defined JWT (
        curl.exe -sS -X "%METHOD%" "%URL%" ^
        -H "Authorization: Bearer %JWT%" ^
        -o "%RESP%" -w "%%{http_code}" > "%STATUS%"
    ) else (
        curl.exe -sS -X "%METHOD%" "%URL%" ^
        -o "%RESP%" -w "%%{http_code}" > "%STATUS%"
    )
)

set /p CODE=<"%STATUS%"

echo HTTP STATUS: %CODE%
echo HTTP STATUS: %CODE%>>"%REPORT%"

echo RESPONSE:
if exist "%RESP%" type "%RESP%"

if exist "%RESP%" (
    echo RESPONSE:>>"%REPORT%"
    type "%RESP%" >> "%REPORT%"
    echo. >> "%REPORT%"
)

echo.

if "%EXPECT%"=="ANY" exit /b 0

if "%EXPECT%"=="2xx" (
    if %CODE% GEQ 200 if %CODE% LSS 300 (
        call :pass "%METHOD% %URL%"
    ) else (
        call :fail "Expected 2xx, got %CODE%"
    )
    exit /b 0
)

if "%CODE%"=="%EXPECT%" (
    call :pass "Expected HTTP %EXPECT%"
) else (
    call :fail "Expected HTTP %EXPECT%, got %CODE%"
)

exit /b 0


REM ==================================================
REM FIND ID USING POWERSHELL
REM Supports:
REM [ {...}, {...} ]
REM { "value": [ {...}, {...} ] }
REM ==================================================

:findid

del "%TMPFILE%" >nul 2>&1

powershell.exe -NoProfile -Command ^
 "$j=Get-Content -Raw '%RESP%' | ConvertFrom-Json; " ^
 "if($j -is [array]){$items=$j} " ^
 "elseif($null -ne $j.value){$items=@($j.value)} " ^
 "else{$items=@()}; " ^
 "$found=$null; " ^
 "foreach($item in $items){" ^
 "$p=$item.PSObject.Properties['%SEARCH_FIELD%']; " ^
 "if($null -ne $p -and [string]$p.Value -eq '%SEARCH_NAME%'){" ^
 "$found=$item; break}}; " ^
 "if($null -ne $found){" ^
 "[IO.File]::WriteAllText('%TMPFILE%', [string]$found.id)}"

exit /b 0


REM ==================================================
REM ASSERTIONS
REM ==================================================

:assert_contains

findstr /i /c:"%~1" "%RESP%" >nul

if errorlevel 1 (
    call :fail "Expected content: %~1"
) else (
    call :pass "Found content: %~1"
)

exit /b


:assert_not_contains

findstr /i /c:"%~1" "%RESP%" >nul

if errorlevel 1 (
    call :pass "Content absent: %~1"
) else (
    call :fail "Unexpected content: %~1"
)

exit /b


REM ==================================================
REM PASS / FAIL
REM ==================================================

:pass
echo [PASS] %~1
echo.
echo [PASS] %~1>>"%REPORT%"
echo.>>"%REPORT%"
set /a PASS+=1
exit /b

:fail
echo [FAIL] %~1
echo.
echo [FAIL] %~1>>"%REPORT%"
echo.>>"%REPORT%"
set /a FAIL+=1
exit /b

REM ==================================================
REM FATAL ERRORS
REM ==================================================

:fatal_token_a

echo.
echo [FATAL] JWT A not found in login response.
goto finish


:fatal_token_b

echo.
echo [FATAL] JWT B not found in login response.
goto finish


:fatal_cat_a

echo.
echo [FATAL] Category A ID not found.
echo SEARCH_NAME: %SEARCH_NAME%
echo SEARCH_FIELD: %SEARCH_FIELD%
echo RESPONSE:
type "%RESP%"
goto finish


:fatal_cat_b

echo.
echo [FATAL] Category B ID not found.
echo SEARCH_NAME: %SEARCH_NAME%
echo SEARCH_FIELD: %SEARCH_FIELD%
echo RESPONSE:
type "%RESP%"
goto finish


:fatal_link_a

echo.
echo [FATAL] Link A ID not found.
echo SEARCH_NAME: %SEARCH_NAME%
echo SEARCH_FIELD: %SEARCH_FIELD%
echo RESPONSE:
type "%RESP%"
goto finish


:fatal_link_b

echo.
echo [FATAL] Link B ID not found.
echo SEARCH_NAME: %SEARCH_NAME%
echo SEARCH_FIELD: %SEARCH_FIELD%
echo RESPONSE:
type "%RESP%"
goto finish


REM ==================================================
REM CLEANUP
REM ==================================================

:finish

del "%RESP%" >nul 2>&1
del "%STATUS%" >nul 2>&1
del "%TMPFILE%" >nul 2>&1

echo.

echo.
echo Report generato:
echo %REPORT%

pause
exit /b
