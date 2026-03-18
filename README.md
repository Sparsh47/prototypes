# 🧪 Prototypes

A personal experimentation playground for exploring new concepts, patterns, and technologies. Each directory is a self-contained mini-project built while learning something new.

---

## 📂 Projects

<details>
<summary><b>⚙️ conc-task-queue</b> — Concurrent Task Queue in Go</summary>

### Overview

A concurrent task queue implementation in Go that demonstrates goroutine-based worker pools, buffered channels, and graceful shutdown patterns.

### Concepts Explored

- **Worker Pool Pattern** — Spawns a configurable number of goroutines to process tasks concurrently
- **Buffered Channels** — Uses Go channels as a thread-safe task buffer between producers and consumers
- **Task Lifecycle Management** — Tasks transition through states: `Pending → Running → Completed / Failed`
- **Graceful Shutdown** — Coordinates worker termination using `sync.WaitGroup` and signal channels

### Project Structure

```
conc-task-queue/
├── cmd/
│   └── main.go              # Application entry point
├── internal/
│   ├── queue/
│   │   ├── queue.go          # Queue — manages workers, task submission & shutdown
│   │   └── worker.go         # Worker loop — picks up tasks and executes them
│   ├── task/
│   │   ├── task.go           # Task struct with payload, execute fn & result
│   │   └── status.go         # TaskStatus enum (Pending, Running, Completed, Failed)
│   ├── concurrency/          # (planned)
│   ├── shutdown/             # (planned)
│   └── storage/              # (planned)
└── go.mod
```

### Tech Stack

`Go`

</details>

---

<details>
<summary><b>🔌 custom-protocol-server</b> — Custom TCP Protocol Server in Go</summary>

### Overview

A lightweight TCP server in Go that implements a custom text-based protocol inspired by Redis. Clients connect over raw TCP and interact using simple single-word commands (`SET`, `GET`, `DEL`) to manage an in-memory key-value store.

### Concepts Explored

- **Custom Text Protocol** — Newline-delimited command parsing over raw TCP (e.g., `SET key value\n`)
- **RESP-Inspired Response Format** — Responses prefixed with `+` for success (`+OK`, `+value`) and `-ERR` for errors
- **Concurrent Client Handling** — Each connection is handled in its own goroutine for parallel client support
- **Thread-Safe In-Memory Store** — Uses `sync.RWMutex` for safe concurrent reads and exclusive writes

### Protocol Reference

| Command | Syntax | Description |
|---------|--------|-------------|
| `SET` | `SET <key> <value>` | Stores a key-value pair |
| `GET` | `GET <key>` | Retrieves the value for a key |
| `DEL` | `DEL <key>` | Deletes a key from the store |

**Response format:**
- `+OK` — Successful write/delete
- `+<value>` — Successful read with returned value
- `-ERR <message>` — Error (invalid command, missing key, etc.)

### Project Structure

```
custom-protocol-server/
├── cmd/
│   └── main.go            # Entry point — starts the server on :8080
├── server/
│   └── server.go          # Server — TCP listener, command parsing & handlers
├── lib/
│   └── utils.go           # Response struct & RESP-style formatter
└── go.mod
```

### Tech Stack

`Go`

</details>

---

<details>
<summary><b>🔄 consistent-hashing</b> — Consistent Hashing Simulation in Node.js</summary>

### Overview

A Node.js prototype demonstrating the difference between simple modulo-based data distribution and consistent hashing algorithms. It simulates placing data keys across a virtual cluster of database nodes and evaluates the amount of data reshuffling required when the cluster scales (e.g., node added or removed).

### Concepts Explored

- **Consistent Hashing Algorithm** — Placing nodes and data on a hashed virtual ring (0 to 2^32-1) to minimize data movement during cluster scaling
- **Modulo Hashing Pitfalls** — Demonstrating how basic `hash % N` operations trigger massive data redistribution when the underlying node count `N` changes
- **State Partitioning Simulation** — Setting up local SQLite databases for each simulated node in a partitioned, stateful cluster environment
- **Cryptographic Hash Uniformity** — Utilizing `SHA-256` from the `crypto` module to predictably and uniformly distribute keys across the network

### Project Structure

```text
consistent-hashing/
├── src/
│   ├── index.ts           # Entry point — simulates hashing methods & scaling events
│   ├── services/
│   │   ├── hash.ts        # Hashing logic (SHA-256 manipulation)
│   │   ├── ring.ts        # Consistent hashing ring implementation
│   │   └── node.ts        # Basic modulo hashing logic
│   └── db/
│       └── init.ts        # SQLite local databases initialization
├── package.json
└── tsconfig.json
```

### Tech Stack

`Node.js`, `TypeScript`, `Express`, `SQLite3`

</details>

---

> **Note:** This repo is a living collection — new experiments will be added over time as I keep learning and building.
