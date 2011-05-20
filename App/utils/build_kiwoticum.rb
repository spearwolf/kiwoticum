#!/usr/bin/env ruby
require "yui/compressor"

ROOT = File.absolute_path(File.join(File.dirname(__FILE__), '..'))

class BuildJsLib

  attr_accessor :base_js

  def initialize(base_js)
    self.base_js = base_js
  end

  def compress
    @content = ""
    File.new(base_js).readlines.each do |line|
      if line =~ /\/\/\s+@include\s+([^)]+)\s*$/
        js_file = $1.chomp
        @content << "// #{js_file}\n" << compress_single_js_file(js_file) << "\n\n"
      else
        @content << line
      end
    end
    @content
  end

  class << self

    def compress(base_js, target_js)
      File.open(target_js, "w") {|f| f.write(new(base_js).compress) }
    end
  end

  private

  def compress_single_js_file(js_file)
    @compressor ||= YUI::JavaScriptCompressor.new
    path = File.absolute_path(File.join(File.dirname(base_js), js_file))
    @compressor.compress(File.read(path))
  end

end

BuildJsLib.compress("#{ROOT}/lib/kiwoticum.js", "#{ROOT}/public/js/kiwoticum-min.js")

