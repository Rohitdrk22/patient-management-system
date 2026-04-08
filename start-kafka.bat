@echo off
setlocal enabledelayedexpansion

REM ===== Paths =====
set BASE_DIR=%~dp0
set KAFKA_HOME=%BASE_DIR%kafka
set CONFIG_FILE=%KAFKA_HOME%\config\server.properties
set LOG_DIR=D:\Practice\Java\PMS\kafka\kafka-logs
set TOPIC_NAME=patient

echo === Step 1: Check Kafka storage ===
echo Log Dir = %LOG_DIR%

IF EXIST "%LOG_DIR%\meta.properties" (
    echo Kafka already formatted ✅
) ELSE (
    echo First time setup -> formatting...

    REM ===== Stable Cluster ID =====
    set CLUSTER_ID=123e4567-e89b-12d3-a456-426614174000

    echo Cluster ID = [!CLUSTER_ID!]

    call "%KAFKA_HOME%\bin\windows\kafka-storage.bat" format ^
        --config "%CONFIG_FILE%" ^
        --cluster-id "!CLUSTER_ID!"

    IF NOT EXIST "%LOG_DIR%\meta.properties" (
        echo ❌ Formatting failed
        pause
        exit /b
    )

    echo Formatting completed ✅
)

echo === Step 2: Start Kafka ===
start "KafkaBroker" cmd /k call "%KAFKA_HOME%\bin\windows\kafka-server-start.bat" "%CONFIG_FILE%"

echo Waiting for Kafka...
timeout /t 25 >nul

echo === Step 3: Create topic ===
call "%KAFKA_HOME%\bin\windows\kafka-topics.bat" ^
 --create --if-not-exists ^
 --topic %TOPIC_NAME% ^
 --bootstrap-server localhost:9092 ^
 --partitions 1 --replication-factor 1

echo === Step 4: Start producer ===
start "Producer" cmd /k call "%KAFKA_HOME%\bin\windows\kafka-console-producer.bat" ^
 --topic %TOPIC_NAME% --bootstrap-server localhost:9092

echo === Step 5: Start consumer ===
start "Consumer" cmd /k call "%KAFKA_HOME%\bin\windows\kafka-console-consumer.bat" ^
 --topic %TOPIC_NAME% --bootstrap-server localhost:9092 --from-beginning

pause

taskkill /FI "WINDOWTITLE eq KafkaBroker" /T