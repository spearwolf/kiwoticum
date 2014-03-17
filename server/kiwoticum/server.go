package kiwoticum

import (
	"appengine"
	"fmt"
	"net/http"
)

func init() {
	http.HandleFunc("/", handler)
}

func handler(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)

	c.Infof("URL=%v", r.URL)
	c.Infof("width=%v", r.FormValue("w"))

	fmt.Fprint(w, "Hello, kiwoticum!")
}
