# 📦 Kafka Setup for PMS Project (KRaft Mode)

This project uses **Apache Kafka (KRaft mode - no Zookeeper)** for local event streaming.

---

## 🚀 Prerequisites

* Java 17+
* Windows (CMD / IntelliJ terminal with `cmd.exe`)
* Apache Kafka 4.x

---

## 📁 Project Structure

```
PMS/
 ├── kafka/                 # (NOT included in repo)
 │    ├── config/           # server.properties, log4j2.yaml
 │    ├── bin/
 │    └── ...
 ├── start-kafka.bat
 ├── .gitignore
 └── README.md
```

---

## ⬇️ Download Kafka (Binary)

1. Go to: https://kafka.apache.org/downloads
2. Download the **Binary version (NOT source code)**
   Example:

   ```
   kafka_2.13-4.x.x.tgz
   ```
3. Extract it into project root:

```
PMS/kafka
```

---

## 🔧 Configuration Changes

All configs are inside:

```
kafka/config/
```

---

### ✅ server.properties (KRaft mode)

Update:

```
kafka/config/server.properties
```

```properties
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@localhost:9093

listeners=PLAINTEXT://:9092,CONTROLLER://:9093
inter.broker.listener.name=PLAINTEXT
advertised.listeners=PLAINTEXT://localhost:9092,CONTROLLER://localhost:9093
controller.listener.names=CONTROLLER
listener.security.protocol.map=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT

log.dirs=./kafka/kafka-logs

num.partitions=1
offsets.topic.replication.factor=1
transaction.state.log.replication.factor=1
transaction.state.log.min.isr=1
```

---

### ✅ log4j2.yaml

Update:

```
kafka/config/log4j2.yaml
```

Change:

```yaml
Appenders:
  Console:
    name: STDOUT
    PatternLayout:
      pattern: "${logPattern}"
```

To:

```yaml
Appenders:
  Console:
    name: STDOUT
    PatternLayout:
      pattern: "[%d] %p %m%n"
```

---

## ▶️ Running Kafka

From project root:

```
.\start-kafka.bat
```

---

## 🧪 Testing

* Producer window → type messages
* Consumer window → receive messages

---

## ❗ Important Notes

* Do NOT delete `kafka-logs` while Kafka is running
* Do NOT re-run format after first setup
* If errors occur:

    1. Stop Kafka
    2. Delete `kafka/kafka-logs`
    3. Restart

---

## 🚫 .gitignore

```
kafka/
**/kafka-logs/
*.log
```

---

## 🧠 Why KRaft Mode?

* No Zookeeper required
* Simpler setup
* Modern Kafka architecture

---

## 👨‍💻 Author

Rohit Kumar
