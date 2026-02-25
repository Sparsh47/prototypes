package task

import "time"

type Task struct {
	id        string
	Payload   interface{}
	ExecuteFn func(payload any) (any, error)
	status    TaskStatus
	result    interface{}
	err       error
	createdAt time.Time
}

func (t *Task) SetRunning() {
	t.status = Running
}

func (t *Task) MarkCompleted(result interface{}) {
	t.status = Completed
	t.result = result
}

func (t *Task) MarkFailed(err error) {
	t.status = Failed
	t.err = err
}

func (t *Task) SetPending() {
	t.status = Pending
}
