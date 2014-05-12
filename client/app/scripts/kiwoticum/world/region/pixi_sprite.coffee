papa.Mixin "kiwoticum.world.region.pixi_sprite", ->

    dependsOn: [
        "kiwoticum.world.region",
        "kiwoticum.world.region.bbox"
    ]

    initialize: (region, exports) ->

        exports.createSprite = ->
            texture = PIXI.Texture.fromCanvas region.canvas
            region.sprite = new PIXI.Sprite texture

            region.sprite.anchor.x = 0.5
            region.sprite.anchor.y = 0.5
            region.sprite.position.x = region.bbox.w / 2
            region.sprite.position.y = region.bbox.h / 2

            region.spriteGroup = new PIXI.DisplayObjectContainer
            region.spriteGroup.position.x = region.bbox.x0
            region.spriteGroup.position.y = region.bbox.y0

            region.spriteGroup.addChild region.sprite
            return region.spriteGroup



# vim: et ts=4 sts=4 sw=4
