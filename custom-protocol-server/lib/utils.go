package lib

import (
	"errors"
	"fmt"
	"strings"
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

func ParseLine(line string) ([]string, error) {
	tokens := []string{}
	var current strings.Builder
	isValueInQuotes := false
	escapeNext := false

	for _, ch := range line {
		if !isValueInQuotes {
			if ch == '"' {
				isValueInQuotes = true
				continue
			}
			if ch == ' ' {
				if current.Len() > 0 {
					tokens = append(tokens, current.String())
					current.Reset()
				}
			} else {
				current.WriteRune(ch)
			}
			continue
		}
		if escapeNext {
			current.WriteRune(ch)
			escapeNext = false
			continue
		}
		if ch == '\\' {
			escapeNext = true
			continue
		}
		if ch == '"' {
			isValueInQuotes = false
			tokens = append(tokens, current.String())
			current.Reset()
			continue
		}
		current.WriteRune(ch)
	}

	if isValueInQuotes {
		return nil, errors.New("unterminated quotes")
	}

	if current.String() != "" {
		tokens = append(tokens, current.String())
	}

	return tokens, nil
}
