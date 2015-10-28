define([
        'underscore',
        'backbone',
        'localstorage'
], function(_, Backbone,localstorage){

	var ExplorationModel = Backbone.Model.extend({
		
		localStorage: new Backbone.LocalStorage("explorations"),
		
	});

	// Return the model for the module
	return ExplorationModel;

});