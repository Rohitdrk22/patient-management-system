# 📦 Kafka Setup for PMS Project (KRaft Mode)

This project uses **Apache Kafka (KRaft mode - no Zookeeper)** for local event streaming.

---

## 🚀 Prerequisites

* Java 17+
* Windows (CMD / IntelliJ terminal with `cmd.exe`)
* Apache Kafka 4.x

---

## 📁 Project Structure

```id="k3g8cs"
PMS/
 ├── kafka/                 # (You will create this)
 │    ├── config/           # server.properties, log4j2.yaml
 │    ├── bin/
 │    └── ...
 ├── start-kafka.bat
 ├── .gitignore
 └── README.md
```

---

## ⬇️ Setup Kafka (IMPORTANT)

### 1. Create Kafka Folder

Inside your project root (`PMS`), create a folder:

```id="y7y2yd"
kafka
```

---

### 2. Download Kafka (Binary)

Go to:
https://kafka.apache.org/downloads

Download the **Binary version (NOT source code)**
Example:

```
kafka_2.13-4.x.x.tgz
```

---

### 3. Extract Kafka

Extract the downloaded file **inside the `kafka` folder**

Final structure should look like:

```id="u0k7wt"
PMS/
 ├── kafka/
 │    ├── bin/
 │    ├── config/
 │    ├── libs/
 │    └── ...
```

---

## 🔧 Configuration Changes

All configs are inside:

```id="bx6apn"
kafka/config/
```

---

### ✅ server.properties (KRaft mode)

Update:

```id="y6qxqv"
kafka/config/server.properties
```

```properties id="s7gclj"
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

```id="m6spbx"
kafka/config/log4j2.yaml
```

Change:

```yaml id="5g8nyy"
Appenders:
  Console:
    name: STDOUT
    PatternLayout:
      pattern: "${logPattern}"
```

To:

```yaml id="2a2dkn"
Appenders:
  Console:
    name: STDOUT
    PatternLayout:
      pattern: "[%d] %p %m%n"
```

---

## ▶️ Running Kafka

From project root:

```id="7u8s3g"
.\start-kafka.bat
```

---

## 🧪 Testing

* Producer window → send messages
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

```id="p0tw7c"
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
