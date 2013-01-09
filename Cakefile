{exec} = require "child_process"

REPORTER = "spec"  # "nyan"

SOURCES_KIWOTICUM_BASE = [
    'src/kiwoticum/country_map_builder.js',
    'src/kiwoticum/spw.country_algorithms.js',
    'src/kiwoticum/perlin-noise-simplex.js'
]

SOURCES_KIWOTICUM_NODE = ['src/kiwoticum-node.js'].concat SOURCES_KIWOTICUM_BASE
SOURCES_KIWOTICUM_WWW = SOURCES_KIWOTICUM_BASE.concat ['src/kiwoticum/svg_renderer.js']


uglifyjs = (sources, outFile, options...) ->
    cmdLine = "#{sources.join ' '} #{options.join ' '} -o #{outFile}"
    console.log "> uglifyjs #{cmdLine}"
    exec "./node_modules/uglify-js/bin/uglifyjs #{cmdLine}", (err, output) ->
        throw err if err
        console.log output


task "build-www", "build www library", ->
    uglifyjs SOURCES_KIWOTICUM_WWW, 'public/javascripts/kiwoticum-min.js', '--wrap kiwoticum'

task "build-node", "build node library", ->
    uglifyjs SOURCES_KIWOTICUM_NODE, 'src/kiwoticum.js', '-b'

task "build", "build sources", ->
    invoke 'build-node'
    invoke 'build-www'


task "test", "run tests", ->
    invoke 'build-node'
    exec "NODE_ENV=test ./node_modules/.bin/mocha --reporter #{REPORTER} --colors", (err, output) ->
        throw err if err
        console.log output

