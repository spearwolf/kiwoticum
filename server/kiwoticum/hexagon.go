// created by wolfger@spearwolf.de

package kiwoticum

import (
	"math"
)

type Hexagon struct {
	Row, Col          uint
	Left, Top         float64
	coords            []Vertex
	Region            *Region
	NeighborNorth     *Hexagon
	NeighborNorthEast *Hexagon
	NeighborSouthEast *Hexagon
	NeighborSouth     *Hexagon
	NeighborSouthWest *Hexagon
	NeighborNorthWest *Hexagon
}

func (hex *Hexagon) MakeCoords(width, height uint, startAtAngle float64) {
	hex.coords = make([]Vertex, 6)

	mx, my := float64(width)/2, float64(height)/2
	lx, ly := mx-1, my-1

	for i := range hex.coords {
		r := (float64(i)*(360/6) + startAtAngle) * (math.Pi / 180)
		hex.coords[i] = Vertex{math.Floor(0.5 + (math.Sin(r)*lx + mx + hex.Left)), math.Floor(0.5 + (math.Cos(r)*ly + my + hex.Top))}
	}
}

func (hex *Hexagon) VertexCoord(i int) *Vertex {
	return &hex.coords[i]
}

func NewHexagon(col, row, width, height uint, left, top, startAtAngle float64) (hex *Hexagon) {
	hex = new(Hexagon)
	hex.Col, hex.Row = col, row
	hex.Left, hex.Top = left, top
	hex.MakeCoords(width, height, startAtAngle)
	return
}
