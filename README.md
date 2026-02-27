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

> **Note:** This repo is a living collection — new experiments will be added over time as I keep learning and building.
