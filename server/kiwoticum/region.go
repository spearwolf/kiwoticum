// created by wolfger@spearwolf.de

package kiwoticum

//type HexPos struct {
//Row, Col uint
//}

const regionHexagonCap uint = 128
const regionNeighborsCap uint = 64
const regionLessNeighborsCap uint = 128

type Region struct {
	hexagons  []*Hexagon
	neighbors []*Region
}

func NewRegion() (region *Region) {
	region = new(Region)
	region.hexagons = make([]*Hexagon, 0, regionHexagonCap)
	region.neighbors = make([]*Region, 0, regionNeighborsCap)
	return
}

func (region *Region) AssignHexagon(hex *Hexagon) *Region {
	if hex.Region != nil {
		panic("Hexagon already has a Region, cannot reassign")
	}
	hex.Region = region
	region.hexagons = append(region.hexagons, hex)
	if hex.NeighborNorth != nil {
		region.addNeighbor(hex.NeighborNorth.Region)
	}
	if hex.NeighborSouth != nil {
		region.addNeighbor(hex.NeighborSouth.Region)
	}
	if hex.NeighborNorthEast != nil {
		region.addNeighbor(hex.NeighborNorthEast.Region)
	}
	if hex.NeighborNorthWest != nil {
		region.addNeighbor(hex.NeighborNorthWest.Region)
	}
	if hex.NeighborSouthEast != nil {
		region.addNeighbor(hex.NeighborSouthEast.Region)
	}
	if hex.NeighborSouthWest != nil {
		region.addNeighbor(hex.NeighborSouthWest.Region)
	}
	return region
}

func (region *Region) AssignHexagons(hexagons []*Hexagon) *Region {
	for _, hex := range hexagons {
		region.AssignHexagon(hex)
	}
	return region
}

func (region *Region) IsNeighbor(other *Region) bool {
	for _, r := range region.neighbors {
		if r == other {
			return true
		}
	}
	return false
}

func (region *Region) addNeighbor(neighbor *Region) *Region {
	if neighbor != nil && !region.IsNeighbor(neighbor) {
		region.neighbors = append(region.neighbors, neighbor)
		neighbor.neighbors = append(neighbor.neighbors, region)
	}
	return region
}

func isNotInside(hexagons []*Hexagon, hex *Hexagon) bool {
	for _, h := range hexagons {
		if hex == h {
			return false
		}
	}
	return true
}

func appendIfUniq(hexagons []*Hexagon, hex *Hexagon) []*Hexagon {
	if isNotInside(hexagons, hex) {
		return append(hexagons, hex)
	}
	return hexagons
}

func (region *Region) UniqRegionLessNeighborHexagons() (regionLess []*Hexagon) {
	regionLess = make([]*Hexagon, 0, regionLessNeighborsCap)
	for _, hex := range region.hexagons {
		if hex.NeighborNorth != nil && hex.NeighborNorth.Region == nil {
			regionLess = appendIfUniq(regionLess, hex.NeighborNorth)
		}
		if hex.NeighborNorthEast != nil && hex.NeighborNorthEast.Region == nil {
			regionLess = appendIfUniq(regionLess, hex.NeighborNorthEast)
		}
		if hex.NeighborNorthWest != nil && hex.NeighborNorthWest.Region == nil {
			regionLess = appendIfUniq(regionLess, hex.NeighborNorthWest)
		}
		if hex.NeighborSouth != nil && hex.NeighborSouth.Region == nil {
			regionLess = appendIfUniq(regionLess, hex.NeighborSouth)
		}
		if hex.NeighborSouthEast != nil && hex.NeighborSouthEast.Region == nil {
			regionLess = appendIfUniq(regionLess, hex.NeighborSouthEast)
		}
		if hex.NeighborSouthWest != nil && hex.NeighborSouthWest.Region == nil {
			regionLess = appendIfUniq(regionLess, hex.NeighborSouthWest)
		}
	}
	return
}
