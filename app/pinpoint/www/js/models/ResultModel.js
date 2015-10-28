define([
        'underscore',
        'backbone',
        'helpers/Utils'
], function(_,Backbone,Utils){

	var ResultModel = Backbone.Model.extend({
		
		defaults: {
			file: false, 
			note: "", 
			type: "picture",
			location: false,
			time: 0,
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