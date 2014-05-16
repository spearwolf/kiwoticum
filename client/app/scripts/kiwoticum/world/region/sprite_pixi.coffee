papa.Mixin "kiwoticum.world.region.sprite_pixi", ->

    dependsOn: [
        "kiwoticum.world.region",
        "kiwoticum.world.region.bbox"
    ]

    initialize: (region, exports) ->

        createRegionSprite = ->
            texture = PIXI.Texture.fromCanvas region.canvas
            region.sprite = new PIXI.Sprite texture

        exports.createSprite = ->
            sprite = createRegionSprite()
            sprite.position.x = region.bbox.x0
            sprite.position.y = region.bbox.y0
            return sprite



# vim: et ts=4 sts=4 sw=4
