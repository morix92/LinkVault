::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGyX8VAjFBoaQQuQNWa7CLsT1Mz+/OGTrV0hZMcNS6D1+5irHNAB5UL2dJsg12BTl8UJMEoWPjWieichqy4P9lSKJdOTvwbudmSA6EAGGnB4k1/EgyQ3c+9Ek80I5SGr8FmxlqYfsQ==
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSjk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+IeA==
::cxY6rQJ7JhzQF1fEqQJhZksaHGQ=
::ZQ05rAF9IBncCkqN+0xwdVsFAlTMbAs=
::ZQ05rAF9IAHYFVzEqQIcIRVfegWXMH/a
::eg0/rx1wNQPfEVWB+kM9LVsJDGQ=
::fBEirQZwNQPfEVWB+kM9LVsJDGQ=
::cRolqwZ3JBvQF1fEqQJQ
::dhA7uBVwLU+EWHiK8FA1KVt5QxaLMWq0CLp8
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::Zh4grVQjdCyDJGyX8VAjFBoaQQuQNWa7CLsT1Mz+/OGTrV0hZMcNS6D1+5irHNAB5UL2dJsg12BTl8UJMEoWPjWieichqy4P9lSKJdOTvwbudmSA6EAGGnB4k1/8hSUwVtJ9ltcv0jWw/0X6jesVyX2f
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off
chcp 65001 > nul
title LinkVault Launcher

echo.
echo =============================================
echo               LINKVAULT
echo =============================================
echo.
echo Avvio container Docker...
echo.

docker compose up --build -d

if errorlevel 1 (
    echo.
    echo ERRORE: Docker Desktop non disponibile.
    echo Verificare che Docker Desktop sia installato e avviato.
    pause
    exit /b
)

echo.
echo =============================================
echo LINKVAULT AVVIATO CORRETTAMENTE
echo =============================================
echo.
echo Apri il browser all'indirizzo:
echo.
echo     http://localhost:4200
echo.
echo.
echo Credenziali Utente Demo:
echo Username: demo
echo Password: demo123
echo.

goto menu

:menu

echo.
echo ---------------------------------------------
echo Comandi disponibili:
echo.
echo stop     - arresta i container
echo clean    - arresta i container e cancella il database
echo restart  - ricostruisce e riavvia lo stack
echo logs     - visualizza i log Docker
echo exit     - arresta i container ed esce
echo ---------------------------------------------
echo.

set /p cmd=LinkVault^>

if /i "%cmd%"=="stop" (

    echo.
    echo Arresto container...
    docker compose down

    echo.
    echo Container arrestati.

    goto menu
)

if /i "%cmd%"=="clean" (

    echo.
    echo Arresto container e rimozione volumi...
    docker compose down -v

    echo.
    echo Ambiente completamente ripulito.

    goto menu
)

if /i "%cmd%"=="restart" (

    echo.
    echo Riavvio stack...

    docker compose down

    docker compose up --build -d

    echo.
    echo Stack riavviato correttamente.

    goto menu
)

if /i "%cmd%"=="logs" (

    docker compose logs -f

    goto menu
)

if /i "%cmd%"=="exit" (

    echo.
    echo Arresto container...

    docker compose down

    echo.
    echo Chiusura launcher...

    exit /b
)

echo.
echo Comando non riconosciuto.

goto menu