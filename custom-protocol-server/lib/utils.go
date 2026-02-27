package lib

import (
	"fmt"
)

type Response struct {
	Value string
	Err   error
}

func FormatResponse(resp Response) string {
	if resp.Err != nil {
		return fmt.Sprintf("-ERR %s", resp.Err)
	} else if resp.Value != "" {
		return fmt.Sprintf("+%s", resp.Value)
	} else {
		return "+OK"
	}
}
