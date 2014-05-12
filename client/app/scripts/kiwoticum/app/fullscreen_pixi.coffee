papa.Module 'kiwoticum.app.fullscreen_pixi', (exports) ->

    mainApp = null
    renderer = null

    canvasWidth = null
    canvasHeight = null
    screenCanvas = null
    shouldResize = yes

    pixelRatio = window.devicePixelRatio or 1
    winWidth = null
    winHeight = null
    pxWidth = null
    pxHeight = null


    readWindowDimension = ->
        winWidth = window.innerWidth
        winHeight = window.innerHeight
        pxWidth = winWidth * pixelRatio
        pxHeight = winHeight * pixelRatio
        return

    exports.create = (app) ->
        mainApp = app

        readWindowDimension()

        renderer = new PIXI.autoDetectRenderer pxWidth, pxHeight
        screenCanvas = renderer.view
        document.body.appendChild screenCanvas

        resizeCanvas()

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

            screenCanvas.style.width = "#{winWidth}px"
            screenCanvas.style.height = "#{winHeight}px"

            renderer.resize canvasWidth, canvasHeight

            if mainApp?
                mainApp.width = canvasWidth
                mainApp.height = canvasHeight
                mainApp.emit 'resize', canvasWidth, canvasHeight


    onFrame = ->
        onFrame.run()
        resizeCanvas() if shouldResize

        if mainApp?
            mainApp.emit 'idle'
            mainApp.emit 'render', renderer


    onFrame.run = -> window.requestAnimationFrame onFrame


    return

# vim: et ts=4 sts=4 sw=4
