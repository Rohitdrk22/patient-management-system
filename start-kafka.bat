@echo off
setlocal enabledelayedexpansion

REM ================================
REM CONFIG
REM ================================
set BASE_DIR=%~dp0
set KAFKA_HOME=%BASE_DIR%kafka
set CONFIG_FILE=%KAFKA_HOME%\config\server.properties
set LOG_DIR=D:\Practice\Java\PMS\kafka\kafka-logs
set TOPIC_NAME=patient

echo =========================================
echo 🚀 KAFKA CLEAN START (KRaft Mode)
echo =========================================

REM ================================
REM STEP 1: KILL OLD KAFKA
REM ================================
echo 🔥 Killing old Kafka processes...
taskkill /F /IM java.exe >nul 2>&1

REM ================================
REM STEP 2: CLEAN LOGS
REM ================================
echo 🧹 Cleaning old Kafka logs...

IF EXIST "%LOG_DIR%" (
    rmdir /s /q "%LOG_DIR%"
)

mkdir "%LOG_DIR%"

REM ================================
REM STEP 3: GENERATE CLUSTER ID
REM ================================
echo 🔑 Generating Cluster ID...

for /f %%i in ('%KAFKA_HOME%\bin\windows\kafka-storage.bat random-uuid') do set CLUSTER_ID=%%i

echo Cluster ID = !CLUSTER_ID!

REM ================================
REM STEP 4: FORMAT STORAGE
REM ================================
echo 📦 Formatting Kafka storage...

call "%KAFKA_HOME%\bin\windows\kafka-storage.bat" format ^
 --config "%CONFIG_FILE%" ^
 --cluster-id "!CLUSTER_ID!"

IF NOT EXIST "%LOG_DIR%\meta.properties" (
    echo ❌ Formatting failed
    pause
    exit /b
)

echo ✅ Storage formatted

REM ================================
REM STEP 5: START KAFKA BROKER
REM ================================
echo 🚀 Starting Kafka broker...

start "KafkaBroker" cmd /k call "%KAFKA_HOME%\bin\windows\kafka-server-start.bat" "%CONFIG_FILE%"

echo ⏳ Waiting for Kafka to boot...
timeout /t 20 >nul

REM ================================
REM STEP 6: CREATE TOPIC
REM ================================
echo 📡 Creating topic...

call "%KAFKA_HOME%\bin\windows\kafka-topics.bat" ^
 --create --if-not-exists ^
 --topic %TOPIC_NAME% ^
 --bootstrap-server localhost:9092 ^
 --partitions 1 ^
 --replication-factor 1

echo ✅ Topic ready

REM ================================
REM STEP 7: START PRODUCER
REM ================================
echo ✍️ Starting Producer...

start "Producer" cmd /k call "%KAFKA_HOME%\bin\windows\kafka-console-producer.bat" ^
 --topic %TOPIC_NAME% ^
 --bootstrap-server localhost:9092

REM ================================
REM STEP 8: START CONSUMER
REM ================================
echo 📥 Starting Consumer...

start "Consumer" cmd /k call "%KAFKA_HOME%\bin\windows\kafka-console-consumer.bat" ^
 --topic %TOPIC_NAME% ^
 --bootstrap-server localhost:9092 ^
 --from-beginning

echo =========================================
echo ✅ Kafka is fully running
echo =========================================

pause

REM Optional cleanup on exit
taskkill /FI "WINDOWTITLE eq KafkaBroker" >nul 2>&1