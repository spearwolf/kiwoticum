{exec} = require "child_process"

REPORTER = "spec"  # "nyan"  # "spec"

task "build", "build sources", ->
    #exec "./node_modules/uglify-js/bin/uglifyjs src/kiwoticum-node.js src/kiwoticum/svg_renderer.js src/kiwoticum/country_map_builder.js src/kiwoticum/spw.country_algorithms.js src/kiwoticum/perlin-noise-simplex.js -b -o src/kiwoticum.js", (err, output) ->
    exec "./node_modules/uglify-js/bin/uglifyjs src/kiwoticum-node.js src/kiwoticum/country_map_builder.js src/kiwoticum/spw.country_algorithms.js src/kiwoticum/perlin-noise-simplex.js -b -o src/kiwoticum.js", (err, output) ->
        throw err if err
        console.log output

task "test", "run tests", ->
    invoke 'build'
    exec "NODE_ENV=test 
        ./node_modules/.bin/mocha 
        --compilers coffee:coffee-script
        --reporter #{REPORTER}
        --require coffee-script 
        --colors
        ", (err, output) ->
            throw err if err
            console.log output

