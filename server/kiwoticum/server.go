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
		GridWidth:             6,
		GridHeight:            6,
		GridOuterPaddingX:     8,
		GridOuterPaddingY:     8,
		GridInnerPaddingX:     2,
		GridInnerPaddingY:     2,
		GridHexWidth:          10,
		GridHexHeight:         10,
		HexWidth:              22,
		HexHeight:             22,
		HexPaddingX:           0,
		HexPaddingY:           0,
		FastGrowIterations:    1,
		MinimalGrowIterations: 42}

	strategy := kiwotigo.NewContinentCreationStrategy(config)
	strategy.CreateRegions()
	strategy.
		strategy.Continent.UpdateCenterPoints()

	fmt.Fprint(w, strategy.Continent.Json())
}
