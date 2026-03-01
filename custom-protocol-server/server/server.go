package server

import (
	"bufio"
	"custom-protocol-server/lib"
	"errors"
	"io"
	"net"
	"strings"
	"sync"
)

type Server struct {
	store map[string]string
	mu    sync.RWMutex
}

func NewServer() *Server {
	return &Server{
		store: make(map[string]string),
	}
}

func (s *Server) Start(address string) {
	listener, err := net.Listen("tcp", address)

	if err != nil {
		panic(err)
	}

	for {
		conn, err := listener.Accept()

		if err != nil {
			panic(err)
		}

		go s.handle(conn)
	}
}

func (s *Server) handle(connection net.Conn) {
	reader := bufio.NewReader(connection)

	defer connection.Close()

	for {
		var resp lib.Response
		line, err := reader.ReadString('\n')
		if err != nil {
			if err == io.EOF {
				return
			}
			return
		}

		line = strings.TrimSpace(line)

		if line == "" {
			continue
		}

		// Old tokenizer logic (for single word values)
		// parts := strings.Split(line, " ")

		// New tokenizer logic (for string as values)
		parts, err := lib.ParseLine(line)
		resp = lib.Response{
			Value: "",
			Err:   err,
		}

		cmd := strings.ToUpper(parts[0])
		switch cmd {
		case "SET":
			if len(parts) != 3 {
				err := errors.New("Invalid SET command")
				resp = lib.Response{
					Value: "",
					Err:   err,
				}
			} else {
				key, value := parts[1], parts[2]
				resp = s.handleSET(key, value)
			}
		case "DEL":
			if len(parts) != 2 {
				err := errors.New("Invalid DEL command")
				resp = lib.Response{
					Value: "",
					Err:   err,
				}
			} else {
				key := parts[1]
				resp = s.handleDEL(key)
			}
		case "GET":
			if len(parts) != 2 {
				err := errors.New("Invalid GET command")
				resp = lib.Response{
					Value: "",
					Err:   err,
				}
			} else {
				key := parts[1]
				resp = s.handleGET(key)
			}
		default:
			err := errors.New("Command does not exist")
			resp = lib.Response{
				Value: "",
				Err:   err,
			}
		}

		formattedResp := lib.FormatResponse(resp)
		connection.Write([]byte(formattedResp + "\n"))
	}
}

func (s *Server) handleSET(key, value string) lib.Response {
	s.mu.Lock()
	defer s.mu.Unlock()

	if value != "" {
		s.store[key] = value
		return lib.Response{
			Value: "",
			Err:   nil,
		}
	} else {
		return lib.Response{
			Value: "",
			Err:   errors.New("no key or value passed"),
		}
	}
}

func (s *Server) handleGET(key string) lib.Response {
	s.mu.RLock()
	defer s.mu.RUnlock()

	value, ok := s.store[key]

	if !ok {
		return lib.Response{
			Value: "",
			Err:   errors.New("key not found"),
		}
	}
	return lib.Response{
		Value: value,
		Err:   nil,
	}
}

func (s *Server) handleDEL(key string) lib.Response {
	s.mu.Lock()
	defer s.mu.Unlock()

	delete(s.store, key)

	return lib.Response{
		Value: "",
		Err:   nil,
	}
}
