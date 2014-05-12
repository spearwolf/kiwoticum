require '../pixi/utils.coffee'

papa.Mixin "kiwoticum.app.world_viewer_pixi", ->

    dependsOn: "events"

    initialize: (app, exports) ->

        setupRegionGroup = do ->
            app.stage = new PIXI.Stage
            app.regionGroup = new PIXI.DisplayObjectContainer
            app.stage.addChild app.regionGroup
            kiwoticum.pixi.utils.activateDrag app.regionGroup
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


        app.on 'render', (renderer) ->
            renderer.render app.stage
            return


# vim: et ts=4 sts=4 sw=4
