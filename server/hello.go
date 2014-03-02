package main

import (
	"fmt"
	"github.com/spearwolf/kiwoticum"
)

func main() {

	fmt.Println("Hello, kiwoticum!")

	model := kiwoticum.NewHexagonModel(5, 5, 20, 20, 0, 0, 90)

	for i := 0; i < 6; i++ {
		fmt.Println(model.Hexagon(0, 0).VertexCoord(i))
	}

	fmt.Println(model)
}
