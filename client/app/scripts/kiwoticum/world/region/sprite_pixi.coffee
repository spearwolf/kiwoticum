papa.Mixin "kiwoticum.world.region.sprite_pixi", ->

    dependsOn: [
        "kiwoticum.world.region",
        "kiwoticum.world.region.bbox"
    ]

    initialize: (region, exports) ->

        createRegionSprite = ->
            texture = PIXI.Texture.fromCanvas region.canvas
            region.sprite = new PIXI.Sprite texture

            #region.sprite.anchor.x = 0.5
            #region.sprite.anchor.y = 0.5
            #region.sprite.position.x = region.bbox.w / 2
            #region.sprite.position.y = region.bbox.h / 2

            #region.spriteGroup.addChild region.sprite
            return region.sprite


        exports.createSprite = ->
            #region.spriteGroup = new PIXI.DisplayObjectContainer
            #region.spriteGroup.position.x = region.bbox.x0
            #region.spriteGroup.position.y = region.bbox.y0

            #createRegionSprite()

            #return region.spriteGroup

            sprite = createRegionSprite()

            sprite.position.x = region.bbox.x0
            sprite.position.y = region.bbox.y0

            return sprite



# vim: et ts=4 sts=4 sw=4
