papa.Module 'kiwoticum.app.fullscreen_pixi', (exports) ->

    mainApp = null
    renderer = null
    stats = null

    canvasWidth = null
    canvasHeight = null
    screenCanvas = null
    shouldResize = yes

    winWidth = null
    winHeight = null
    pxWidth = null
    pxHeight = null


    readWindowDimension = ->
        winWidth = window.innerWidth
        winHeight = window.innerHeight
        pxWidth = winWidth  * kiwoticum.pixelRatio
        pxHeight = winHeight  * kiwoticum.pixelRatio
        return

    createStatsWidget = ->
        unless navigator.isCocoonJS
            stats = new Stats
            stats.setMode 0
            stats.domElement.style.position = "absolute"
            stats.domElement.style.top = "0"
            stats.domElement.style.left = "0"
            document.body.appendChild stats.domElement

    exports.create = (app) ->
        mainApp = app

        readWindowDimension()

        renderer = new PIXI.CanvasRenderer pxWidth, pxHeight
        #renderer = new PIXI.autoDetectRenderer pxWidth, pxHeight  #, null, yes, yes
        #PIXI.CanvasTinter.convertTintToImage = yes  # XXX only android?

        screenCanvas = renderer.view
        screenCanvas.screencanvas = yes if navigator.isCocoonJS
        document.body.appendChild screenCanvas

        resizeCanvas()
        createStatsWidget()

        window.addEventListener 'resize', -> shouldResize = yes

        onFrame.run()


    exports.setMainApp = (app) ->
        if app? and mainApp isnt app
            mainApp = app
            app.emit 'resize', screenCanvas.width, screenCanvas.height


    resizeCanvas = ->
        shouldResize = no
        readWindowDimension()

        if canvasWidth isnt pxWidth or canvasHeight isnt pxHeight
            canvasWidth = pxWidth
            canvasHeight = pxHeight

            console.log "canvas size is #{canvasWidth}x#{canvasHeight}"

            screenCanvas.style.width = "#{winWidth}px"
            screenCanvas.style.height = "#{winHeight}px"

            renderer.resize canvasWidth, canvasHeight

            if mainApp?
                mainApp.width = canvasWidth
                mainApp.height = canvasHeight
                mainApp.emit 'resize', canvasWidth, canvasHeight


    onFrame = ->
        stats.begin() if stats?

        document.body.scrollTop = 0  # => iOS7 minimal-ui issue

        resizeCanvas() if shouldResize

        if mainApp?
            mainApp.emit 'idle'
            mainApp.emit 'render', renderer

        stats.end() if stats?
        onFrame.run()


    onFrame.run = -> window.requestAnimationFrame onFrame


    return
# vim: et ts=4 sts=4 sw=4
