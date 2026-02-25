package task

type TaskStatus int

const (
	Pending = iota
	Running
	Completed
	Failed
)
