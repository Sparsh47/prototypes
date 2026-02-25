package queue

func (q *Queue) workerLoop(workerID int) {
	for {
		select {
		case task, ok := <-q.tasks:
			if !ok {
				return
			}
			task.SetRunning()
			result, err := task.ExecuteFn(task.Payload)

			if err != nil {
				task.MarkFailed(err)
				continue
			} else {
				task.MarkCompleted(result)
				continue
			}
		case <-q.shutdown:
			return
		}
	}
}
