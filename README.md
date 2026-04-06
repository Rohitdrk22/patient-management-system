# 📦 Kafka Setup for PMS Project (KRaft Mode)

This project uses **Apache Kafka (KRaft mode - no Zookeeper)** for local event streaming.

---

## 🚀 Prerequisites

* Java 17+
* Windows (CMD / IntelliJ terminal with `cmd.exe`)
* Apache Kafka 4.x
* **Docker & Docker Compose (for Docker setup)** ⚠️

👉 Make sure Docker is installed and running on your system before using Docker commands.

---

## 📁 Project Structure

```id="2v8c8p"
PMS/
 ├── kafka/                 # (You will create this for local setup)
 │    ├── config/
 │    ├── bin/
 │    └── ...
 ├── start-kafka.bat
 ├── docker-compose.yml     # (for Docker setup)
 ├── .gitignore
 └── README.md
```

---

# 🧭 Choose How You Want to Run

---

## 🖥️ Option 1: Run Locally (Manual Kafka Setup)

### ⬇️ Step 1: Create Kafka Folder

```id="c6j1n3"
mkdir kafka
```

---

### ⬇️ Step 2: Download Kafka (Binary)

Go to:
https://kafka.apache.org/downloads

Download **Binary version (NOT source code)**

Example:

```id="q3nq9o"
kafka_2.13-4.x.x.tgz
```

---

### ⬇️ Step 3: Extract Kafka

Extract inside `kafka/` folder:

```id="yk8m5o"
PMS/
 ├── kafka/
 │    ├── bin/
 │    ├── config/
 │    ├── libs/
 │    └── ...
```

---

### 🔧 Step 4: Configuration Changes

📍 Location:

```id="t4md1m"
kafka/config/
```

---

#### ✅ server.properties

```properties id="6gknr1"
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

#### ✅ log4j2.yaml

```yaml id="i0v8ra"
Appenders:
  Console:
    name: STDOUT
    PatternLayout:
      pattern: "[%d] %p %m%n"
```

---

### ▶️ Step 5: Run Kafka

```bash id="2t5k4g"
.\start-kafka.bat
```

---

### 🧪 Testing

* Producer window → send messages
* Consumer window → receive messages

---

## 🐳 Option 2: Run with Docker (Recommended 🚀)

### ▶️ Start Services

```bash id="y1d8xk"
docker-compose up --build
```

---

### 🛑 Stop Services

Press:

```id="fuvg0c"
Ctrl + C (twice if needed)
```

Then:

```bash id="2t9d2k"
docker-compose down
```

---

### 🧹 Remove Everything (including data)

```bash id="c93q7n"
docker-compose down -v
```

---

## ⚠️ Risks & Considerations

### 🔴 Data Loss

Running:

```bash id="z4k2fi"
docker-compose down -v
```

will **permanently delete all volume data** (Kafka logs, DB data, etc.)

---

### 🟡 Safe Cleanup

```bash id="7n6j0x"
docker-compose stop
```

Stops containers without deleting data.

---

### 🔵 Restart Services

```bash id="3g3i9r"
docker-compose up -d
```

⚠️ If `-v` was used earlier → data will be lost.

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

```id="6e0g9r"
kafka/
**/kafka-logs/
*.log
*.tmp
```

---

## 🧠 Why KRaft Mode?

* No Zookeeper required
* Simpler setup
* Modern Kafka architecture

---

## 👨‍💻 Author

Rohit Kumar
