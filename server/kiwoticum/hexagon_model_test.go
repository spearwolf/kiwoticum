// created by wolfger@spearwolf.de

package kiwoticum

import "testing"

func testHexagonRowCol(t *testing.T, model *HexagonModel, col, row uint) {
	hex := model.Hexagon(col, row)
	if hex == nil {
		t.Error("Hexagon at [", col, ",", row, "] should exists")
	}
	if hex.Row != row {
		t.Error("Hexagon.Row at [", col, ",", row, "] expected", row, ", got", hex.Row)
	}
	if hex.Col != col {
		t.Error("Hexagon.Col at [", col, ",", row, "] expected", col, ", got", hex.Col)
	}
}

func TestHexagonModelGetHexagon(t *testing.T) {

	model := NewHexagonModel(10, 10, 20, 20, 0, 0, 90)

	testHexagonRowCol(t, model, 0, 0)
	testHexagonRowCol(t, model, 0, 9)
	testHexagonRowCol(t, model, 9, 0)
	testHexagonRowCol(t, model, 9, 9)

	hex := model.Hexagon(10, 10)
	if hex != nil {
		t.Error("Hexagon at [10, 10] expected nil, got", hex)
	}
}
