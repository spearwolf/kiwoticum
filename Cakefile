{exec} = require "child_process"

REPORTER = "nyan"  # "spec"

task "build", "build sources", ->
    exec "./node_modules/uglify-js/bin/uglifyjs src/kiwoticum.js src/kiwoticum/svg_renderer.js src/kiwoticum/country_map_builder.js src/kiwoticum/spw.country_algorithms.js -o public/javascripts/kiwoticum-min.js", (err, output) ->
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

