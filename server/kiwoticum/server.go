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
		GridHeight:            10,
		GridOuterPaddingX:     25,
		GridOuterPaddingY:     25,
		GridInnerPaddingX:     6,
		GridInnerPaddingY:     3,
		GridHexWidth:          16,
		GridHexHeight:         14,
		HexWidth:              12,  //24,
		HexHeight:             12,  //,
		HexPaddingX:           0,   //5,  //3,
		HexPaddingY:           0,   //5,  //3,
		FastGrowIterations:    8,   //10,
		MinimalGrowIterations: 120, //48,
		MaxRegionSizeFactor:   3}

	strategy := kiwotigo.NewContinentCreationStrategy(config)
	continent := strategy.BuildContinent()

	//fmt.Fprint(w, continent.Json())

	result := kiwotigo.NewContinentDescription(continent, &config)
	fmt.Fprint(w, result.Json())

}
