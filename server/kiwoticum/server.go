package kiwoticum

import (
	"appengine"
	"fmt"
	"kiwotigo"
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
		GridWidth:         10,
		GridHeight:        10,
		GridOuterPaddingX: 10,
		GridOuterPaddingY: 10,
		GridHexWidth:      10,
		GridHexHeight:     10,
		HexWidth:          20,
		HexHeight:         20}

	strategy := kiwotigo.NewContinentCreationStrategy(config)
	strategy.CreateRegions()
	strategy.Continent.CreateAllShapes()

	fmt.Fprint(w, strategy.Continent.Json())
}
