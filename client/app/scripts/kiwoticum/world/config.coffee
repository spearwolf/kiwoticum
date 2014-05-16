papa.Mixin "kiwoticum.world.config", -> (world) ->

    world.conf =
        region:
            PaddingX: 20
            PaddingY: 20

            ShapeStroke: no
            ShapeStrokeStyle: "rgba(0,0,0,0.5)"

            PixelZoom: no                      # use "no" to disable
            FullPathVectorPixelator: 4         # use "no" to disable
            PathSmoothing: 1.3                 # use "no" to disable

            ShapeFillStyle: "#f0f0f0"

            CenterStrokeStyle: "#800030"
            CenterLineWidth: 2


# vim: et ts=4 sts=4 sw=4
