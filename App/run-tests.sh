#!/bin/bash
#------------------
# File: run-tests.sh
# Author: Wolfger Schramm <wolfger@spearwolf.de>
# Created: 19.04.2011 15:23:56 CEST

./utils/build_kiwoticum.rb
phantomjs test/testrunner.js file://`pwd`/test/index.html
