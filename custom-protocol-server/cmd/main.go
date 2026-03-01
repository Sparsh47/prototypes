package main

import (
	"custom-protocol-server/server"
)

func main() {

	s := server.NewServer()

	s.Start(":8080")

}
