papa.Mixin "kiwoticum.app.world_viewer_pixi", ->

    dependsOn: "events"

    initialize: (app, exports) ->

        centerRegionGroup = ->
            app.regionGroup.position.x = app.width / 2
            app.regionGroup.position.y = app.height / 2
            return

        activateDrag = (displayObject) ->
            app.regionGroup.interactive = yes
            app.regionGroup.buttonMode = yes

            # use the mousedown and touchstart
            displayObject.mousedown = displayObject.touchstart = (data) ->
                # stop the default event...
                data.originalEvent.preventDefault()

                # store a reference to the data
                # The reason for this is because of multitouch
                # we want to track the movement of this particular touch
                @data = data
                @alpha = 0.9
                @dragging = yes
                pos = data.getLocalPosition @parent
                @originalPosition = x: pos.x, y: pos.y

            # set the events for when the mouse is released or a touch is released
            displayObject.mouseup = displayObject.mouseupoutside = displayObject.touchend = displayObject.touchendoutside = (data) ->
                @alpha = 1
                @dragging = no
                #// set the interaction data to null
                @data = null

            # set the callbacks for when the mouse or a touch moves
            displayObject.mousemove = displayObject.touchmove = (data) ->
                if @dragging
                    newPosition = @data.getLocalPosition @parent
                    @position.x = newPosition.x - @originalPosition.x
                    @position.y = newPosition.y - @originalPosition.y


        setupRegionGroup = do ->
            app.stage = new PIXI.Stage
            app.regionGroup = new PIXI.DisplayObjectContainer
            app.stage.addChild app.regionGroup
            #centerRegionGroup()
            activateDrag app.regionGroup
            return


        exports.setWorld = (world) ->
            return if app.world
            app.world = world

            for region in world.regions
                app.regionGroup.addChild region.createSprite()

            world.regions[0].sprite.tint = 0xff0060
            world.regions[2].sprite.tint = 0x4030f0
            world.regions[5].sprite.tint = 0xf0a000

            app.on 'idle', ->
                world.regions[0].sprite.rotation += 0.01

            return


        #app.on 'resize', centerRegionGroup

        app.on 'render', (renderer) -> renderer.render app.stage



# vim: et ts=4 sts=4 sw=4
