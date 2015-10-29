define([
        'underscore',
        'backbone',
        'helpers/Utils'
], function(_,Backbone,Utils){

	var ResultModel = Backbone.Model.extend({
		
		defaults: {
			note: "", 
			action: "none",
			location: false,
			time: 0,
			picture: false,
			recording: false
		},
		
		initialize: function() {
			this.set({
				time: _.now(),
				id: Utils.guid() //create guid for record entries
			})
		}
		
	});

	// Return the model for the module
	return ResultModel;

});