#!/usr/bin/env ruby
require "yui/compressor"
require_relative "build_js_lib"

ROOT = File.absolute_path(File.join(File.dirname(__FILE__), '..'))

BuildJsLib.compress("#{ROOT}/lib/kiwoticum.js", "#{ROOT}/public/js/kiwoticum-min.js")

