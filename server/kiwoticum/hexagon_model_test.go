// created by wolfger@spearwolf.de

package kiwoticum

import "testing"

func makeHexagonModel() *HexagonModel {
	return NewHexagonModel(10, 10, 20, 20, 0, 0, 90)
}

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

	model := makeHexagonModel()

	testHexagonRowCol(t, model, 0, 0)
	testHexagonRowCol(t, model, 0, 9)
	testHexagonRowCol(t, model, 9, 0)
	testHexagonRowCol(t, model, 9, 9)

	hex := model.Hexagon(10, 10)
	if hex != nil {
		t.Error("Hexagon at [10, 10] expected nil, got", hex)
	}
}

//     __    __    __    __    __
//    /0 \__/2 \__/  \__/  \__/8 \__
//    \_0/1 \_0/  \__/  \__/  \_0/9 \
//    /0 \_0/  \__/  \__/  \__/8 \_0/
//    \_1/1 \__/  \__/  \__/  \_1/9 \
//    /  \_1/  \__/  \__/  \__/  \_1/
//    \__/  \__/  \__/  \__/  \__/  \
//    /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//    /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//    /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//    /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//    /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//    /0 \__/  \__/  \__/  \__/  \__/
//    \_8/1 \__/  \__/  \__/  \__/9 \
//    /0 \_8/  \__/  \__/  \__/8 \_8/
//    \_9/1 \__/  \__/  \__/  \_9/9 \
//       \_9/  \__/  \__/  \__/  \_9/
//
func TestHexagonModelNeighbors(t *testing.T) {

	model := makeHexagonModel()

	hex := model.Hexagon(0, 0)
	shouldNotExist(t, hex.NeighborNorthEast, "NeighborNorthEast")
	shouldNotExist(t, hex.NeighborNorth, "NeighborNorth")
	shouldNotExist(t, hex.NeighborNorthWest, "NeighborNorthWest")
	shouldNotExist(t, hex.NeighborSouthWest, "NeighborSouthWest")
	shouldExist(t, hex.NeighborSouth, "NeighborSouth")
	shouldExist(t, hex.NeighborSouthEast, "NeighborSouthEast")
	testNeighbor(t, hex.NeighborSouth, 0, 1, "NeighborSouth")
	testNeighbor(t, hex.NeighborSouthEast, 1, 0, "NeighborSouthEast")

	hex = model.Hexagon(0, 9)
	shouldExist(t, hex.NeighborNorthEast, "NeighborNorthEast")
	shouldExist(t, hex.NeighborNorth, "NeighborNorth")
	shouldNotExist(t, hex.NeighborNorthWest, "NeighborNorthWest")
	shouldNotExist(t, hex.NeighborSouthWest, "NeighborSouthWest")
	shouldNotExist(t, hex.NeighborSouth, "NeighborSouth")
	shouldExist(t, hex.NeighborSouthEast, "NeighborSouthEast")
	testNeighbor(t, hex.NeighborNorth, 0, 8, "NeighborNorth")
	testNeighbor(t, hex.NeighborNorthEast, 1, 8, "NeighborNorthEast")
	testNeighbor(t, hex.NeighborSouthEast, 1, 9, "NeighborSouthEast")

	hex = model.Hexagon(1, 9)
	shouldExist(t, hex.NeighborNorthEast, "NeighborNorthEast")
	shouldExist(t, hex.NeighborNorth, "NeighborNorth")
	shouldExist(t, hex.NeighborNorthWest, "NeighborNorthWest")
	shouldNotExist(t, hex.NeighborSouthWest, "NeighborSouthWest")
	shouldNotExist(t, hex.NeighborSouth, "NeighborSouth")
	shouldNotExist(t, hex.NeighborSouthEast, "NeighborSouthEast")

	hex = model.Hexagon(1, 8)
	shouldExist(t, hex.NeighborNorthEast, "NeighborNorthEast")
	shouldExist(t, hex.NeighborNorth, "NeighborNorth")
	shouldExist(t, hex.NeighborNorthWest, "NeighborNorthWest")
	shouldExist(t, hex.NeighborSouthWest, "NeighborSouthWest")
	shouldExist(t, hex.NeighborSouth, "NeighborSouth")
	shouldExist(t, hex.NeighborSouthEast, "NeighborSouthEast")

	hex = model.Hexagon(9, 9)
	shouldNotExist(t, hex.NeighborNorthEast, "NeighborNorthEast")
	shouldExist(t, hex.NeighborNorth, "NeighborNorth")
	shouldExist(t, hex.NeighborNorthWest, "NeighborNorthWest")
	shouldNotExist(t, hex.NeighborSouthWest, "NeighborSouthWest")
	shouldNotExist(t, hex.NeighborSouth, "NeighborSouth")
	shouldNotExist(t, hex.NeighborSouthEast, "NeighborSouthEast")
	testNeighbor(t, hex.NeighborNorth, 9, 8, "NeighborNorth")
	testNeighbor(t, hex.NeighborNorthWest, 8, 9, "NeighborNorthWest")
}

func testNeighbor(t *testing.T, neighbor *Hexagon, x, y uint, message string) {
	if neighbor == nil {
		t.Error("Expected", message, " Hexagon, got nil")
	}
	if x != neighbor.Col {
		t.Error("Expected", message, " Hexagon.Col=", x, ", got", neighbor.Col)
	}
	if y != neighbor.Row {
		t.Error("Expected", message, " Hexagon.Row=", y, ", got", neighbor.Row)
	}
}

func shouldNotExist(t *testing.T, neighbor *Hexagon, message string) {
	if neighbor != nil {
		t.Error("Expected", message, "to be nil, got", neighbor)
	}
}

func shouldExist(t *testing.T, neighbor *Hexagon, message string) {
	if neighbor == nil {
		t.Error("Expected", message, "to be exist, got nil")
	}
}

//     0_ 1  2_ 3  4_ 5  6_ 7  8_ 9
//  0 /  \__/  \__/  \__/  \__/c \__
//    \__/a \__/b \__/  \__/  \__/C \
//  1 /a \__/a \__/b \__/  \__/c \__/
//    \__/A \_b/B \__/b \__/  \__/c \
//  2 /a \__/a \__/B \__/  \__/  \__/
//    \__/a \_b/b \__/b \__/  \__/  \
//  3 /  \__/  \__/b \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//  4 /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//  5 /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//  6 /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//  7 /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//  8 /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//  9 /  \__/  \__/  \__/  \__/  \__/
//    \__/  \__/  \__/  \__/  \__/  \
//       \__/  \__/  \__/  \__/  \__/
//
func TestRegionUniqRegionLessNeighborHexagons(t *testing.T) {

	model := makeHexagonModel()

	regionA, regionB, regionC := new(Region), new(Region), new(Region)

	regionA.AssignHexagon(model.Hexagon(1, 1))
	regionB.AssignHexagon(model.Hexagon(3, 1)).AssignHexagon(model.Hexagon(4, 2))
	regionC.AssignHexagon(model.Hexagon(9, 0))

	// regionA
	regionLess := regionA.UniqRegionLessNeighborHexagons()
	if len(regionLess) != 6 {
		t.Error("regionA expected to have 6 region-less-neighbor-hexagons, got", len(regionLess))
	}

}
