package kiwoticum

import (
	"appengine"
	"fmt"
	"github.com/spearwolf/kiwotigo"
	"net/http"
)

func init() {
	http.HandleFunc("/api/v1/create", handler)
}

func handler(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)

	c.Infof("URL=%v", r.URL)
	//c.Infof("width=%v", r.FormValue("w"))
	//fmt.Fprint(w, "Hello, kiwoticum!")

	config := kiwotigo.ContinentConfig{
		GridWidth:             9,
		GridHeight:            6,
		GridOuterPaddingX:     8,
		GridOuterPaddingY:     8,
		GridInnerPaddingX:     2,
		GridInnerPaddingY:     2,
		GridHexWidth:          12,
		GridHexHeight:         10,
		HexWidth:              16,
		HexHeight:             16,
		HexPaddingX:           3,
		HexPaddingY:           3,
		FastGrowIterations:    1,
		MinimalGrowIterations: 64}

	strategy := kiwotigo.NewContinentCreationStrategy(config)
	strategy.CreateRegions()
	strategy.Continent.UpdateCenterPoints()
	strategy.Continent.MakeNeighbors()

	fmt.Fprint(w, strategy.Continent.Json())
}
