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
		GridWidth:             10,
		GridHeight:            6,
		GridOuterPaddingX:     10,
		GridOuterPaddingY:     10,
		GridInnerPaddingX:     2,
		GridInnerPaddingY:     2,
		GridHexWidth:          6,  //6,
		GridHexHeight:         6,  //6,
		HexWidth:              24, //24,
		HexHeight:             24, //24,
		HexPaddingX:           5,  //3,
		HexPaddingY:           5,  //3,
		FastGrowIterations:    1,
		MinimalGrowIterations: 24, //48,
		MaxRegionSizeFactor:   5}

	strategy := kiwotigo.NewContinentCreationStrategy(config)
	continent := strategy.BuildContinent()

	fmt.Fprint(w, continent.Json())
}
