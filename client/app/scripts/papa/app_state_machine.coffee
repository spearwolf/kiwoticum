papa = require './papa'
require './factory'
require './events'
{state_machine} = require './coffee_state_machine'

papa.Mixin "app_state_machine", ->

	namespace: 'state'
	dependsOn: 'events'

	initialize: (app, exports) ->

		state_machine "state", extend: exports, (state, event, transition) ->

			state.initial "created"

			state "setup", parent: "initialize"
			state "loading", parent: "initialize"
			state "postInit", parent: "initialize"

			state "running", parent: "ready"
			state "paused", parent: "ready"


			event "start", ->
				transition.from "created", to: "setup", -> app.emit "setup"
				transition.from "postInit", to: "running", ->
					app.emit "started"

			event "loadAssets", ->
				transition.from "setup", to: "loading"  # TODO load assets

			event "assetsLoaded", ->
				transition.from "loading", to: "postInit", ->
					app.emit "assetsLoaded"
					exports.start()
