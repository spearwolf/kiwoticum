require '../pixi/utils.coffee'

papa.Mixin "kiwoticum.app.world_viewer_pixi", ->

    dependsOn: "events"

    initialize: (app, exports) ->

        do ->
            app.stage = new PIXI.Stage 0x6080a0
            app.regionGroup = new PIXI.DisplayObjectContainer
            app.stage.addChild app.regionGroup
            app.regionInnerGroup = new PIXI.SpriteBatch  # -> pixi 1.5+
            #app.regionInnerGroup = new PIXI.DisplayObjectContainer
            app.regionGroup.addChild app.regionInnerGroup
            return

        exports.setWorld = (world) ->
            return if app.world
            app.world = world

            kiwoticum.pixi.utils.activateDrag app.regionGroup,
                    new PIXI.Rectangle(
                        -world.data.width/2,
                        -world.data.height/2,
                        world.data.width*2,
                        world.data.height*2 )

            #app.regionInnerGroup.pivot.x = 0.5
            #app.regionInnerGroup.pivot.y = 0.5
            #app.regionInnerGroup.rotation = 45 * Math.PI / 180.0

            #i = 0
            for region in world.regions
                app.regionInnerGroup.addChild region.createSprite()
                #break if ++i > 10
                #region.sprite.tint = 0x555555

            #world.regions[0].sprite.tint = 0x00ff00
            #world.regions[2].sprite.tint = 0x00ffff
            #world.regions[5].sprite.tint = 0xff00ff
            #world.regions[world.regions.length-1].sprite.tint = 0xff0000
            #world.regions[world.regions.length-3].sprite.tint = 0x0000ff
            #world.regions[world.regions.length-6].sprite.tint = 0xffff00

            #app.on 'idle', ->
                #world.regions[0].sprite.rotation += 0.01
                #world.regions[world.regions.length-1].sprite.rotation -= 0.01

            return


        app.on 'render', (renderer) ->
            renderer.render app.stage
            return


# vim: et ts=4 sts=4 sw=4
