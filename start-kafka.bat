@echo off

REM Get current directory (project root)
set BASE_DIR=%~dp0

set KAFKA_HOME=%BASE_DIR%kafka
set CONFIG_FILE=%KAFKA_HOME%\config\server.properties
set LOG_DIR=%KAFKA_HOME%\kafka-logs
set TOPIC_NAME=patient

echo === Step 1: Check Kafka storage ===

IF EXIST "%LOG_DIR%\meta.properties" (
    echo Kafka already formatted ✅
) ELSE (
    echo First time setup → formatting...

    for /f "delims=" %%i in ('%KAFKA_HOME%\bin\windows\kafka-storage.bat random-uuid') do set CLUSTER_ID=%%i

    echo Cluster ID = %CLUSTER_ID%

    %KAFKA_HOME%\bin\windows\kafka-storage.bat format --config %CONFIG_FILE% --cluster-id %CLUSTER_ID%
)

echo === Step 2: Start Kafka ===
start "KafkaBroker" cmd /k "%KAFKA_HOME%\bin\windows\kafka-server-start.bat %CONFIG_FILE%"

timeout /t 15 >nul

echo === Step 3: Create topic ===
%KAFKA_HOME%\bin\windows\kafka-topics.bat --create --if-not-exists --topic %TOPIC_NAME% --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

echo === Step 4: Start producer ===
start "Producer" cmd /k "%KAFKA_HOME%\bin\windows\kafka-console-producer.bat --topic %TOPIC_NAME% --bootstrap-server localhost:9092"

echo === Step 5: Start consumer ===
start "Consumer" cmd /k "%KAFKA_HOME%\bin\windows\kafka-console-consumer.bat --topic %TOPIC_NAME% --bootstrap-server localhost:9092 --from-beginning"

pause

taskkill /FI "WINDOWTITLE eq KafkaBroker" /T /F