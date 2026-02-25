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

> **Note:** This repo is a living collection — new experiments will be added over time as I keep learning and building.
