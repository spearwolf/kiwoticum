papa = require './papa'
require './factory'
require './events'
{state_machine} = require './coffee_state_machine'

papa.Factory "app_state_machine", ->

	namespace: 'state'
	dependsOn: 'events'

	initialize: (exports, self) ->

		state_machine "state", extend: exports, (state, event, transition) ->

			state.initial "created"

			state "setup", parent: "initialize"
			state "loading", parent: "initialize"
			state "postInit", parent: "initialize"

			state "running", parent: "ready"
			state "paused", parent: "ready"


			event "start", ->
				transition.from "created", to: "setup", -> self.emit "setup"
				transition.from "postInit", to: "running", ->
					self.emit "started"

			event "loadAssets", ->
				transition.from "setup", to: "loading"  # TODO load assets

			event "assetsLoaded", ->
				transition.from "loading", to: "postInit", ->
					self.emit "assetsLoaded"
					exports.start()

