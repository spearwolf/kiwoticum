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
		GridWidth:             14, //9,
		GridHeight:            14, //6,
		GridOuterPaddingX:     8,
		GridOuterPaddingY:     8,
		GridInnerPaddingX:     2,
		GridInnerPaddingY:     2,
		GridHexWidth:          12,
		GridHexHeight:         10,
		HexWidth:              18, //16,
		HexHeight:             18, //16,
		HexPaddingX:           1,  //3,
		HexPaddingY:           1,  //3,
		FastGrowIterations:    3,
		MinimalGrowIterations: 64,
		MaxRegionSizeFactor:   4}

	strategy := kiwotigo.NewContinentCreationStrategy(config)
	continent := strategy.BuildContinent()

	fmt.Fprint(w, continent.Json())
}
