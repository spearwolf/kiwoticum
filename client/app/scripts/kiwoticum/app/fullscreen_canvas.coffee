papa.Module 'kiwoticum.app.fullscreen_canvas', (exports) ->

    mainApp = null
    screenCanvas = null
    ctx = null
    shouldResize = yes
    canvasWidth = null
    canvasHeight = null


    exports.create = (app) ->
        mainApp = app
        screenCanvas = document.createElement 'canvas'
        screenCanvas.screencanvas = yes if navigator.isCocoonJS
        ctx = screenCanvas.getContext '2d'

        resizeCanvas()
        document.body.appendChild screenCanvas

        window.addEventListener 'resize', -> shouldResize = yes

        onFrame.run()


    exports.setMainApp = (app) ->
        if app? and mainApp isnt app
            mainApp = app
            app.emit 'resize', screenCanvas.width, screenCanvas.height


    resizeCanvas = ->
        shouldResize = no
        winWidth = window.innerWidth
        winHeight = window.innerHeight
        pixelRatio = window.devicePixelRatio or 1
        pxWidth = winWidth * pixelRatio
        pxHeight = winHeight * pixelRatio

        if canvasWidth isnt pxWidth or canvasHeight isnt pxHeight
            screenCanvas.width = pxWidth
            screenCanvas.height = pxHeight
            screenCanvas.style.width = "#{winWidth}px"
            screenCanvas.style.height = "#{winHeight}px"

            if mainApp?
                mainApp.width = pxWidth
                mainApp.height = pxHeight
                mainApp.emit 'resize', pxWidth, pxHeight


    onFrame = ->
        onFrame.run()
        resizeCanvas() if shouldResize

        if mainApp?
            mainApp.emit 'idle'
            mainApp.emit 'render', ctx


    onFrame.run = -> window.requestAnimationFrame onFrame


    return

# vim: et ts=4 sts=4 sw=4
