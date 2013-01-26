{exec} = require "child_process"

REPORTER = "spec"  # "nyan"

SOURCES_KIWOTICUM_BASE = [
    'src/kiwoticum/builder/country_map_builder.js',
    'src/kiwoticum/builder/spw.country_algorithm.js',
    'src/kiwoticum/utils/perlin-noise-simplex.js',
    'src/kiwoticum/builder/json_renderer.js'
]

SOURCES_KIWOTICUM_NODE = ['src/kiwoticum-node.js'].concat SOURCES_KIWOTICUM_BASE
SOURCES_KIWOTICUM_WWW = SOURCES_KIWOTICUM_BASE.concat ['src/kiwoticum/ui/svg_renderer.js']


C_RED = '\u001b[31m'
C_YELLOW = '\u001b[33m'
C_BLUE = '\u001b[34m'
C_BOLD = '\u001b[1m'
C_RESET = '\u001b[0m'

print_section = (title) -> console.log "#{C_BOLD}** #{title} **#{C_RESET}"


_exec = (cmdLine, onFinish) ->
    console.log "> #{cmdLine}"
    exec cmdLine, (error, stdout, stderr) ->
        console.log stdout unless stdout.length is 0
        if error
            console.error stderr
            throw error
        onFinish() if onFinish

uglifyjs = (sources, outFile, options...) ->
    cmdLine = "#{sources.join ' '} #{options.join ' '} -o #{outFile}"
    return "./node_modules/uglify-js/bin/uglifyjs #{cmdLine}"

add_header = (headerFile, outFile, onFinish) ->
    _exec "cat #{headerFile} > #{outFile}", ->
        _exec "cat #{outFile}.tmp >> #{outFile}", ->
            _exec "rm #{outFile}.tmp", onFinish


task "build-www", "build www library -> 'public/javascripts/kiwoticum-min.js'", ->
    print_section "build-www"
    _exec uglifyjs(SOURCES_KIWOTICUM_WWW, 'public/javascripts/kiwoticum-min.js.tmp', '--wrap kiwoticum'), ->
        add_header 'src/kiwoticum-header.js', 'public/javascripts/kiwoticum-min.js'

task "build-node", "build node library -> 'src/kiwoticum.js'", ->
    print_section "build-node"
    _exec uglifyjs(SOURCES_KIWOTICUM_NODE, 'src/kiwoticum.js', '-b')

task "build", "build all", ->
    invoke 'build-node'
    invoke 'build-www'

task "test", "run all tests from test/*", ->
    invoke 'build-node'
    print_section "test"
    _exec "NODE_ENV=test ./node_modules/.bin/mocha --reporter #{REPORTER} --colors"



isUncaughtException = no

process.on "uncaughtException", (error) ->
    isUncaughtException = yes
    console.error "#{C_BOLD}#{C_RED}Aborted because of errors.#{C_RESET}\n"

process.on "exit", ->
    console.log "#{C_BOLD}#{C_YELLOW}Ready.#{C_RESET}\n" unless isUncaughtException


