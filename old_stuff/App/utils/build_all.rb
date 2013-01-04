#!/usr/bin/env ruby
require "yui/compressor"
require_relative "build_js_lib"

ROOT = File.absolute_path(File.join(File.dirname(__FILE__), '..'))

#BuildJsLib.compress("#{ROOT}/lib/custom_event.js", "#{ROOT}/public/js/cutom_event-min.js")
#BuildJsLib.compress("#{ROOT}/lib/kiwoticum.js", "#{ROOT}/public/js/kiwoticum-min.js")

for js in %w(custom_event kiwoticum)
  BuildJsLib.compress("#{ROOT}/lib/#{js}.js", "#{ROOT}/public/js/#{js}-min.js")
end

