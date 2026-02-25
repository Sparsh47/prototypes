package queue

import (
	"concurrent-task-queue/internal/task"
	"sync"
)

type Queue struct {
	tasks       chan *task.Task
	workerCount int
	waitGroup   sync.WaitGroup
	shutdown    chan struct{}
}

func NewQueue(workerCount, bufferSize int) *Queue {
	return &Queue{
		tasks:       make(chan *task.Task, bufferSize),
		workerCount: workerCount,
		shutdown:    make(chan struct{}),
	}
}

func (q *Queue) Start() {
	for i := 0; i < q.workerCount; i++ {
		q.waitGroup.Add(1)
		// worker loop logic
		go func(workerID int) {
			defer q.waitGroup.Done()
			q.workerLoop(workerID)
		}(i)
	}
}

func (q *Queue) Submit(task *task.Task) {
	if task == nil {
		return
	}
	task.SetPending()
	q.tasks <- task
}

func (q *Queue) Shutdown() {
	close(q.shutdown)
	close(q.tasks)
	q.waitGroup.Wait()
}
