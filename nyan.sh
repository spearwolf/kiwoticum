#!/bin/bash
#------------------
# File: mocha.sh
# Author: Wolfger Schramm <wolfger@spearwolf.de>

./node_modules/.bin/cake build && ./node_modules/.bin/mocha --reporter nyan --colors
