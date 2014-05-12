papa.Module 'kiwoticum.pixi.utils', (exports) ->

    # http://www.goodboydigital.com/pixi-js-now-even-better-at-being-interactive/
    #
    exports.activateDrag = (displayObject, hitArea) ->
        displayObject.interactive = yes
        displayObject.buttonMode = yes
        displayObject.hitArea = hitArea if hitArea

        # use the mousedown and touchstart
        displayObject.mousedown = displayObject.touchstart = (data) ->
            # stop the default event...
            data.originalEvent.preventDefault()

            # store a reference to the data
            # The reason for this is because of multitouch
            # we want to track the movement of this particular touch
            @data = data
            #@alpha = 0.9
            @dragging = yes
            pos = data.getLocalPosition @
            @originalPosition =
                x: pos.x
                y: pos.y
            #console.log 'originalPosition', @originalPosition, 'position', @position

        # set the events for when the mouse is released or a touch is released
        displayObject.mouseup = displayObject.mouseupoutside = displayObject.touchend = displayObject.touchendoutside = (data) ->
            #@alpha = 1
            @dragging = no
            #// set the interaction data to null
            @data = null

        # set the callbacks for when the mouse or a touch moves
        displayObject.mousemove = displayObject.touchmove = (data) ->
            if @dragging
                newPosition = @data.getLocalPosition @parent
                @position.x = newPosition.x - @originalPosition.x
                @position.y = newPosition.y - @originalPosition.y
                #console.log 'newPosition', newPosition, 'position', @position

        return

    return
# vim: et ts=4 sts=4 sw=4
